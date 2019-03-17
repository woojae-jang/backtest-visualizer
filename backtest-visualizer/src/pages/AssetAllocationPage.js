import React, { Component } from "react";
import { BackTest, BackTestArgsHandler } from "../utils/simulation";
import { getRandomAllocation } from "../utils/utils";
import * as mathjs from "mathjs";
// import ChartExample5 from '../chart5/ChartExample5';
// import DateRange from '../input/DateRange';
import AssetAllocationChart from "../components/AssetAllocationChart";

class AssetAllocationPage extends Component {
  // state = {
  //   data: []
  // };

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

  simulationOnce() {
    const newAllocation = getRandomAllocation(16);
    // const newAllocation = [0,0,0,0,0,0,100,0,0,0,0,0,0,0,0,0]
    const backTestArgsHandler = new BackTestArgsHandler();
    backTestArgsHandler.replaceAllocation(newAllocation);
    const testArgs = backTestArgsHandler.getArgs();
    const backTest = new BackTest();
    backTest.init(testArgs);
    backTest.run();
    backTest.createMetaData();
    const result = backTest.result();
    this.tempData.push({
      x: result.std,
      y: result.finalReturn,
      labels: newAllocation,
      sharpeRatio: result.sharpeRatio
    });

    return {
      allocation: newAllocation,
      finalReturn: result.finalReturn,
      result: result
    };
  }

  simulationLoop() {
    let i = 0;
    const startTime = Date.now();
    let curTime = Date.now();
    let bestAllocation = null;
    while (true) {
      // if(i == 5000) break;

      let resultObject = this.simulationOnce();
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

      i++;

      curTime = Date.now();
      if (curTime - startTime > 1000) break;
    }
  }

  handleOnClick(event) {
    this.simulationLoop();
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

  // <div>{this.props.slidersBundle}</div>
  render() {
    return (
      <div className="asset-allocation-page">
        {/* <div>{this.props.datePickers}</div> */}
        {/* <div>{this.props.datePickers}</div> */}
        {/* <DateRange /> */}
        <button onClick={this.handleOnClick}>Run</button>
        <button onClick={this.handleResetClick}>Reset</button>
        <AssetAllocationChart data={this.state.data} />
      </div>
    );
  }
}

export default AssetAllocationPage;
