import React, { Component } from "react";
import CorrelationChart from "components/CorrelationChart";
import MarketCalendar from "components/MarketCalendar";
import { GET_GLOBAL_VARIABLES, GET_COR_PAGE } from "apollo/queries";
import { Query } from "react-apollo";
import { Market } from "market";
import CompareAssetsSelect from "./CompareAssetsSelect";

const market = new Market();

class AssetCorrelationPage extends Component {
  render() {
    return (
      <Query query={GET_GLOBAL_VARIABLES}>
        {({ loading, error, data, client }) => {
          const { startDate, endDate } = data.globalVariables;
          return (
            <div>
              <div className="asset-allocation-page">
                <MarketCalendar data={data} client={client} />

                <Query query={GET_COR_PAGE}>
                  {result => {
                    const { one, another } = result.data.correlationPage;
                    const oneReturns = market.getReturnsListInRange(
                      one,
                      startDate,
                      endDate
                    );
                    const anotherReturns = market.getReturnsListInRange(
                      another,
                      startDate,
                      endDate
                    );

                    const chartData = {
                      data: oneReturns.map((oneReturn, index) => {
                        return { x: oneReturn, y: anotherReturns[index] };
                      }),
                      xLabel: one,
                      yLabel: another
                    };

                    return (
                      <React.Fragment>
                        <CompareAssetsSelect
                          data={result.data}
                          client={client}
                        />
                        <CorrelationChart data={chartData} />
                      </React.Fragment>
                    );
                  }}
                </Query>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default AssetCorrelationPage;
