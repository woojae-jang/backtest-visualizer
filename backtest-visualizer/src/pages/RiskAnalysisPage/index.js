import React from "react";
import { GET_GLOBAL_VARIABLES } from "apollo/queries";
import "antd/dist/antd.css";
import { Query } from "react-apollo";
import RiskChart from "components/RiskChart";
import MarketCalendar from "components/MarketCalendar";
import SelectSingleInput from "components/SelectSingleInput";
// import SelectInput from "components/SelectInput";

class RiskAnalysisPage extends React.Component {
  render() {
    return (
      <div id="chart">
        <h1>RiskAnalysisPage</h1>
        <p>자산의 Rolling Standard Deviation 을 보여줌</p>
        <Query query={GET_GLOBAL_VARIABLES}>
          {({ loading, error, data, client }) => {
            return (
              <div>
                <SelectSingleInput data={data} client={client} />
                <RiskChart data={data} />
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default RiskAnalysisPage;
