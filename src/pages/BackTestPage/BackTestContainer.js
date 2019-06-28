import React, { Component } from "react";
import { Query } from "react-apollo";
import * as math from "mathjs";
import { GET_GLOBAL_VARIABLES } from "apollo/queries";
import BackTestPresenter from "./BackTestPresenter";
import { assetCodeList, getAssetShortName } from "utils/data";
import { dateList, firstDateOfMonth, firtDateOfWeek } from "priceData";
import { BackTest, BackTestArgsHandler } from "utils/simulation";
// import { BackTest as backTesting, main, strategyStore } from "backtesting";

class BackTestContainer extends Component {
  render() {
    return (
      <Query query={GET_GLOBAL_VARIABLES}>
        {({ loading, error, data, client }) => {
          return (
            <BackTestPresenter
              rootComp={this}
              data={data}
              client={client}
              columns={this.columns}
              dataSource={this.state.dataSource}
              func={{ runSimulation: this.runSimulation }}
              resultList={this.state.resultList}
              selectPortfolioHandler={this.selectPortfolioHandler}
              selectedPortfolio={this.state.selectedPortfolio}
              refreshHandler={this.refreshHandler}
              setLogScale={this.setLogScale}
              isLogScale={this.state.logScale}
              batchSelection={this.batchSelection}
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
      dataSource: [],
      count: 0
    };

    this.state = {
      dataSource,
      resultList: [],
      selectedPortfolio: null,
      logScale: false
    };
  }

  runSimulation = (
    variables,
    weightsList,
    name,
    rebalanceType = "none",
    strategyType = "none",
    strategyArg1 = "none",
    strategyArg2 = "none",
    strategyArg3 = "none",
    selectedAsset = "none"
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
    const backTestArgs = {
      strategyType,
      strategyArg1,
      strategyArg2,
      strategyArg3,
      selectedAsset
    };
    executeBacktest(backTest, backTestArgs);
    backTest.createMetaData();
    const result = backTest.result();
    console.log(result);

    this.setState({ resultList: [...this.state.resultList, { result, name }] });
  };

  // runSimulation2 = (
  //   variables,
  //   weightsList,
  //   name,
  //   rebalanceType = "none",
  //   strategyType = "none",
  //   strategyArg1 = "none",
  //   strategyArg2 = "none",
  //   strategyArg3 = "none",
  //   selectedAsset = "none"
  // ) => {
  //   const { startDate, endDate } = variables;
  //   const strategy = strategyStore["momentum"];

  //   const context = {
  //     startDate,
  //     endDate,
  //     rebalanceType: rebalanceType,
  //     taxRate: 0,
  //     commissionRate: 0.00015,
  //     strategyArgs: {
  //       momentumWindow: 80,
  //       top: 2
  //     }
  //   };

  //   let backtest = new backTesting(context, strategy);
  //   backtest.run();
  //   const result = backtest.result();
  //   this.setState({ resultList: [...this.state.resultList, { result, name }] });
  // };

  refreshSimulations = (
    variables,
    weightsList,
    name,
    rebalanceType = "none",
    strategyType = "none",
    strategyArg1 = "none",
    strategyArg2 = "none",
    strategyArg3 = "none",
    selectedAsset = "none"
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

    const backTestArgs = {
      strategyType,
      strategyArg1,
      strategyArg2,
      strategyArg3,
      selectedAsset
    };

    executeBacktest(backTest, backTestArgs);

    backTest.createMetaData();
    const result = backTest.result();

    return { result, name };
  };

  selectPortfolioHandler = (portName, selectedDate) => {
    this.setState({
      selectedPortfolio: { name: portName, date: selectedDate }
    });
  };

  refreshHandler = variables => {
    const { dataSource } = this.state.dataSource;
    const resultList = this.state.resultList;
    const numOfPreSimulation = resultList.length;
    const newResultList = [];

    for (let i = 0; i < numOfPreSimulation; i++) {
      const data = dataSource[i];
      const weightsList = [];
      assetCodeList.forEach(code => {
        weightsList.push(data[code]);
      });
      weightsList.push(0);

      const {
        name,
        rebalanceType,
        strategyType,
        strategyArg1,
        strategyArg2,
        strategyArg3,
        selectedAsset
      } = data;

      const result = this.refreshSimulations(
        variables,
        weightsList,
        name,
        rebalanceType,
        strategyType,
        strategyArg1,
        strategyArg2,
        strategyArg3,
        selectedAsset
      );
      newResultList.push(result);
    }

    this.setState({
      resultList: newResultList
    });
  };

  setLogScale = () => {
    this.setState({
      logScale: !this.state.logScale
    });
  };

  batchSelection = (column, newValue) => {
    // column 종류 : rebalanceType, strategyType, strategyArg1, strategyArg2, strategyArg3, selectedAsset
    const { dataSource } = this.state.dataSource;

    const newDataSource = dataSource.map(port => {
      port[column] = newValue;
      return port;
    });
    this.setState({
      dataSource: newDataSource
    });
  };
}

const executeBacktest = (backTest, backTestArgs) => {
  const {
    strategyType,
    strategyArg1,
    strategyArg2,
    strategyArg3,
    selectedAsset
  } = backTestArgs;

  if (strategyType === "none") {
    backTest.run();
  } else if (strategyType === "momentum") {
    const simulationArgs = { momentumWindow: strategyArg1 };
    backTest.run2(simulationArgs);
  } else if (strategyType === "momentum2") {
    const simulationArgs = {
      top: strategyArg1,
      momentumWindow: strategyArg2
    };
    backTest.run3(simulationArgs);
  } else if (strategyType === "momentum3") {
    backTest.run4(backTestArgs);
  } else if (strategyType === "momentum4") {
    const momentumWindow = strategyArg1;
    backTest.run5(backTestArgs);
  } else if (strategyType === "momentum5") {
    const topLimit = strategyArg1;
    backTest.run6(topLimit);
  } else if (strategyType === "momentum6") {
    const momentumWindow = strategyArg1;
    const absScore = strategyArg2 / 100;
    backTest.run7(momentumWindow, absScore);
  } else if (strategyType === "momentum7") {
    const topLimit = strategyArg1;
    const momentumWindow = strategyArg2;
    backTest.run8(topLimit, momentumWindow);
  } else if (strategyType === "momentum8") {
    const momentumWindow = strategyArg1;
    const asset = selectedAsset;
    backTest.run9(momentumWindow, asset);
  } else if (strategyType === "momentum9") {
    const momentumWindow = strategyArg1;
    const top = strategyArg2;
    backTest.run10(momentumWindow, top);
  } else if (strategyType === "momentum10") {
    const momentumWindow = strategyArg1;
    backTest.run11(momentumWindow);
  } else if (strategyType === "momentum11") {
    const top = strategyArg1;
    const momentumWindow = strategyArg2;
    backTest.run12(top, momentumWindow);
  } else if (strategyType === "momentum12") {
    const momentumWindow = strategyArg1;
    const top = strategyArg2;
    const stockWeight = strategyArg3;
    const asset = selectedAsset;
    backTest.run13(momentumWindow, top, stockWeight, asset);
  } else if (strategyType === "momentum13") {
    backTest.run14(backTestArgs);
  } else if (strategyType === "momentum14") {
    const momentumWindow = strategyArg1;
    const top = strategyArg2;
    backTest.run15(momentumWindow, top);
  }
};

export default BackTestContainer;
