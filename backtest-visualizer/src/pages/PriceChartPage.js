import React from "react";
import "./PriceChartPage.css";
import { GET_GLOBAL_VARIABLES } from "../apollo/queries";
import "antd/dist/antd.css";
import { Query } from "react-apollo";
import PriceChart from "../components/PriceChart";
import MarketCalendar from "../components/MarketCalendar";
import SelectInput from "../components/SelectInput";

class PriceChartPage extends React.Component {
  render() {
    return (
      <div id="chart">
        <h1>PriceChart</h1>
        <Query query={GET_GLOBAL_VARIABLES}>
          {({ loading, error, data, client }) => {
            return (
              <div>
                <SelectInput />
                <MarketCalendar data={data} client={client} />
                <PriceChart data={data} />
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default PriceChartPage;
