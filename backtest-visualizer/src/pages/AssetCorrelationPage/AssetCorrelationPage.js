import React, { Component } from "react";
import { assetCodeList } from "utils/data";
import CorChart from "components/CorChart";
import MarketCalendar from "components/MarketCalendar";
import { GET_GLOBAL_VARIABLES } from "apollo/queries";
import { Query } from "react-apollo";
import SelectInput from "components/SelectInput";
import * as math from "mathjs";

class AssetCorrelationPage extends Component {
  render() {
    return (
      <Query query={GET_GLOBAL_VARIABLES}>
        {({ loading, error, data, client }) => {
          const { codeList, startDate, endDate } = data.globalVariables;
          return (
            <div>
              <div className="asset-allocation-page">
                <SelectInput data={data} client={client} />
                <MarketCalendar data={data} client={client} />
                <CorChart />
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default AssetCorrelationPage;
