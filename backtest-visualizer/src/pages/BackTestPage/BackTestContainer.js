import React, { Component } from "react";
import { Query } from "react-apollo";
import * as math from "mathjs";
import { GET_GLOBAL_VARIABLES } from "apollo/queries";
import { BackTest, BackTestArgsHandler } from "utils/simulation";
import BackTestPresenter from "./BackTestPresenter";
import { getRandAllocWithFixedWeights } from "utils/utils";
import { assetCodeList, getAssetShortName } from "utils/data";
import { Button } from "antd";
import { dateList, firstDateOfMonth } from "priceData";

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
        dataIndex: "name"
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
          name: `Port #0`,
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
          rebalanceType: "none"
        }
      ],
      count: 1
    };

    this.state = { dataSource, resultList: [] };
  }

  runSimulation = (variables, weightsList, name, rebalanceType = "none") => {
    console.log(rebalanceType);
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
      console.log("none");
      backTestArgsHandler.setRebalanceDateList([]);
    } else if (rebalanceType === "daily") {
      console.log("daily");
      backTestArgsHandler.setRebalanceDateList(dateList);
    } else if (rebalanceType === "weekly") {
      console.log("weekly");
      // backTestArgsHandler.rebalanceDateList = [];
    } else if (rebalanceType === "monthly") {
      console.log("monthly");
      backTestArgsHandler.setRebalanceDateList(firstDateOfMonth);
    }

    const testArgs = backTestArgsHandler.getArgs();
    const backTest = new BackTest();

    backTest.init(testArgs);
    backTest.run();
    backTest.createMetaData();
    const result = backTest.result();

    this.setState({ resultList: [...this.state.resultList, { result, name }] });
  };
}

export default BackTestContainer;
