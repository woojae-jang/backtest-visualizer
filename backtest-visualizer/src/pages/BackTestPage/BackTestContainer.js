import React, { Component } from "react";
import { Query } from "react-apollo";
import * as math from "mathjs";
import { GET_GLOBAL_VARIABLES } from "apollo/queries";
import { BackTest, BackTestArgsHandler } from "utils/simulation";
import { assetCodeList } from "utils/data";
import BackTestPresenter from "./BackTestPresenter";

class BackTestContainer extends Component {
  render() {
    return (
      <Query query={GET_GLOBAL_VARIABLES}>
        {({ loading, error, data, client }) => {
          return (
            <BackTestPresenter
              data={data}
              client={client}
              handleOnClick={this.handleOnClick}
              stateData={this.state.data}
            />
          );
        }}
      </Query>
    );
  }

  constructor(props) {
    super(props);
    this.simulationOnce = this.simulationOnce.bind(this);
  }

  simulationOnce(variables, weightsList) {
    const { startDate, endDate, codeList } = variables;
    let newAllocation = weightsList;

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

    return result;
  }
}

export default BackTestContainer;
