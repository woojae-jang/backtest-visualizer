import React, { Component } from "react";
import { BackTest, BackTestArgsHandler } from "utils/simulation";
import { getRandAllocWithFixedWeights } from "utils/utils";
import { assetCodeList } from "utils/data";
import AssetAllocationChart from "components/AssetAllocationChart";
import MarketCalendar from "components/MarketCalendar";
import { GET_GLOBAL_VARIABLES } from "apollo/queries";
import { Query } from "react-apollo";
import { summaryTable } from "utils/simulation";
import SelectInput from "components/SelectInput";
import ResultTable from "components/ResultTable";
import ReturnsChart from "components/ReturnsChart";
import DoughnutChart from "components/DoughnutChart";
import * as math from "mathjs";

class AssetAllocationPage extends Component {
  render() {
    return (
      <Query query={GET_GLOBAL_VARIABLES}>
        {({ loading, error, data, client }) => {
          const { codeList, startDate, endDate } = data.globalVariables;
          const table = summaryTable(codeList, startDate, endDate);
          return (
            <div>
              <div className="asset-allocation-page">
                <SelectInput data={data} client={client} />
                <MarketCalendar data={data} client={client} />
                {table ? <ResultTable data={table} /> : null}
                <button onClick={e => this.handleOnClick(e, data)}>Run</button>
                <button onClick={this.handleResetClick}>Reset</button>
                <AssetAllocationChart
                  data={this.state.data}
                  fixedAllocation={table}
                  client={client}
                />
                <ReturnsChart data={data} />
                <DoughnutChart data={data} />
              </div>
            </div>
          );
        }}
      </Query>
    );
  }

  constructor(props) {
    super(props);
    this.simulationOnce = this.simulationOnce.bind(this);
    this.simulationLoop = this.simulationLoop.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.state = {
      data: []
    };
    this.tempData = [];
  }

  simulationOnce(variables) {
    const { startDate, endDate, codeList } = variables;

    const tmpArray = new Array(16).fill(0);
    codeList.forEach(code => {
      const codeIndex = assetCodeList.indexOf(code);
      if (codeIndex !== -1) {
        tmpArray[codeIndex] = null;
      }
    });

    let newAllocation = getRandAllocWithFixedWeights(tmpArray);

    // EF LINE 에 영향을 미침
    newAllocation = newAllocation.map(value => math.floor(value));
    const remainWieght = 100 - math.sum(newAllocation);
    newAllocation[newAllocation.length - 1] += remainWieght;

    const backTestArgsHandler = new BackTestArgsHandler();
    backTestArgsHandler.replaceAllocation(newAllocation);
    backTestArgsHandler.setDateRange(startDate, endDate);

    const testArgs = backTestArgsHandler.getArgs();
    const backTest = new BackTest();
    backTest.init(testArgs);
    backTest.run();
    backTest.createMetaData();
    const result = backTest.result();
    this.tempData.push({
      x: math.round(result.std, 4),
      y: math.round(result.finalReturn, 4),
      labels: newAllocation,
      sharpeRatio: result.sharpeRatio
    });

    return {
      allocation: newAllocation,
      finalReturn: result.finalReturn,
      result: result
    };
  }

  simulationLoop(variables) {
    // let i = 0;
    const startTime = Date.now();
    let curTime = Date.now();
    // let bestAllocation = null;
    while (true) {
      // if(i == 5000) break;

      this.simulationOnce(variables);
      // let resultObject = this.simulationOnce();
      // if(bestAllocation === null){
      // bestAllocation = resultObject;
      // } else {
      // if(resultObject.finalReturn > bestAllocation.finalReturn){
      // bestAllocation = resultObject;
      // // console.log(i);
      // // console.log(bestAllocation);
      // // console.log(resultObject.result);
      // }
      // }

      // i++;

      curTime = Date.now();
      if (curTime - startTime > 1000) break;
    }
  }

  simulationLoopWithTimeLimit(limitTime = 1000) {
    const startTime = Date.now();
    let curTime = Date.now();
    while (true) {
      this.simulationOnce();
      curTime = Date.now();
      if (curTime - startTime > limitTime) break;
    }
  }

  simulationLoopWithCountsLimit(limitCounts = 1000) {
    let i = 0;
    while (true) {
      if (i === limitCounts) break;
      this.simulationOnce();
      i++;
    }
  }

  handleOnClick(event, data) {
    const globalVariables = data.globalVariables;
    this.simulationLoop(globalVariables);
    this.setState({
      data: this.tempData
    });
    this.tempData = [];
  }

  handleResetClick(event) {
    this.setState({
      data: "reset"
    });
  }
}

export default AssetAllocationPage;
