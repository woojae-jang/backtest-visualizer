import React, { Component } from "react";
import { Query } from "react-apollo";
import * as math from "mathjs";
import { GET_GLOBAL_VARIABLES } from "apollo/queries";
import { BackTest, BackTestArgsHandler } from "utils/simulation";
import BackTestPresenter from "./BackTestPresenter";
import { assetCodeList, getAssetShortName } from "utils/data";
import { dateList, firstDateOfMonth, firtDateOfWeek } from "priceData";

class BackTestContainer extends Component {
  render() {
    return (
      <Query query={GET_GLOBAL_VARIABLES}>
        {({ loading, error, data, client }) => {
          return (
            <BackTestPresenter
              data={data}
              client={client}
              columns={this.columns}
              dataSource={this.state.dataSource}
              func={{ runSimulation: this.runSimulation }}
              resultList={this.state.resultList}
              selectPortfolioHandler={this.selectPortfolioHandler}
              selectedPortfolio={this.state.selectedPortfolio}
            />
          );
        }}
      </Query>
    );
  }

  constructor(props) {
    super(props);

    const columns = [
      {
        title: "name",
        dataIndex: "name",
        editable: true
      }
    ];

    assetCodeList.forEach(code => {
      columns.push({
        title: getAssetShortName(code),
        dataIndex: code,
        editable: true
      });
    });

    this.columns = columns;

    const dataSource = {
      dataSource: [
        {
          key: "0",
          name: `Port #1`,
          "069500": 100,
          "232080": 0,
          "143850": 0,
          "195930": 0,
          "238720": 0,
          "192090": 0,
          "148070": 0,
          "136340": 0,
          "182490": 0,
          "132030": 0,
          "130680": 0,
          "114800": 0,
          "138230": 0,
          "139660": 0,
          "130730": 0,
          rebalanceType: "none",
          strategyType: "none",
          strategyArg1: "none",
          strategyArg2: "none"
        }
      ],
      count: 1
    };

    this.state = { dataSource, resultList: [], selectedPortfolio: null };
  }

  runSimulation = (
    variables,
    weightsList,
    name,
    rebalanceType = "none",
    strategyType = "none",
    strategyArg1 = "none",
    strategyArg2 = "none"
  ) => {
    const { startDate, endDate } = variables;
    let newAllocation = weightsList;

    // EF LINE 에 영향을 미침
    newAllocation = newAllocation.map(value => math.floor(value));
    const remainWieght = 100 - math.sum(newAllocation);
    newAllocation[newAllocation.length - 1] += remainWieght;

    const backTestArgsHandler = new BackTestArgsHandler();
    backTestArgsHandler.replaceAllocation(newAllocation);
    backTestArgsHandler.setDateRange(startDate, endDate);
    if (rebalanceType === "none") {
      backTestArgsHandler.setRebalanceDateList([]);
    } else if (rebalanceType === "daily") {
      backTestArgsHandler.setRebalanceDateList(dateList);
    } else if (rebalanceType === "weekly") {
      backTestArgsHandler.setRebalanceDateList(firtDateOfWeek);
    } else if (rebalanceType === "monthly") {
      backTestArgsHandler.setRebalanceDateList(firstDateOfMonth);
    }

    const testArgs = backTestArgsHandler.getArgs();
    const backTest = new BackTest();

    backTest.init(testArgs);

    console.log("strategyArg1, strategyArg2");
    console.log(strategyArg1, strategyArg2);

    if (strategyType === "none") {
      backTest.run();
    } else if (strategyType === "momentum") {
      const momentumWindow = strategyArg1;
      backTest.run2(momentumWindow);
    } else if (strategyType === "momentum2") {
      const topLimit = strategyArg1;
      backTest.run3(topLimit);
    } else if (strategyType === "momentum3") {
      backTest.run4();
    } else if (strategyType === "momentum4") {
      backTest.run5();
    }

    backTest.createMetaData();
    const result = backTest.result();

    this.setState({ resultList: [...this.state.resultList, { result, name }] });
  };

  selectPortfolioHandler = (portName, selectedDate) => {
    this.setState({
      selectedPortfolio: { name: portName, date: selectedDate }
    });
  };
}

export default BackTestContainer;
