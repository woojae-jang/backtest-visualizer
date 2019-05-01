import React, { Component } from "react";
import { Query } from "react-apollo";
import { GET_GLOBAL_VARIABLES } from "apollo/queries";
import { BackTest, BackTestArgsHandler, summaryTable } from "utils/simulation";
import { getRandAllocWithFixedWeights } from "utils/utils";
import { assetCodeList } from "utils/data";
import { Button } from "antd";
import WeightsInputTable2 from "components/WeightsInputTable2";
import InputForm from "./InputForm";
import BackTestContainer from "pages/BackTestPage";

class BackTestPage extends Component {
  render() {
    return (
      <Query query={GET_GLOBAL_VARIABLES}>
        {({ loading, error, data, client }) => {
          const { codeList, startDate, endDate } = data.globalVariables;
          return (
            <div>
              <div className="asset-allocation-page">
                <InputForm />
                <BackTestContainer />
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default BackTestPage;
