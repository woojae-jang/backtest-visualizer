import React, { Component } from "react";
import { Query } from "react-apollo";
import * as jStat from "jStat";
import { GET_GLOBAL_VARIABLES, GET_COR_PAGE } from "apollo/queries";
import { Market } from "market";
import { getAssetName } from "utils/data";
import { tradingDateList } from "utils/data";
import AssetCorrelationPresenter from "./AssetCorrelationPresenter";

const market = new Market();

class AssetCorrelationContainer extends Component {
  render() {
    return (
      <Query query={GET_GLOBAL_VARIABLES}>
        {({ loading, error, data, client }) => {
          const { startDate, endDate } = data.globalVariables;
          return (
            <Query query={GET_COR_PAGE}>
              {result => {
                const {
                  one,
                  another,
                  rolling,
                  baseDate
                } = result.data.correlationPage;
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

                const corrcoeff = jStat.corrcoeff(oneReturns, anotherReturns);

                const nameOfOne = getAssetName(one);
                const nameOfAnother = getAssetName(another);

                const chartData = {
                  data: oneReturns.map((oneReturn, index) => {
                    return { x: oneReturn, y: anotherReturns[index] };
                  }),
                  xLabel: nameOfOne,
                  yLabel: nameOfAnother
                };

                const subEndDate = baseDate;
                const idxOfSubEndDate = tradingDateList.indexOf(subEndDate);
                const subStartDate =
                  tradingDateList[idxOfSubEndDate - rolling + 1];

                let subChartData = null;
                if (subStartDate && subEndDate) {
                  const subOneReturns = market.getReturnsListInRange(
                    one,
                    subStartDate,
                    subEndDate
                  );
                  const subAnotherReturns = market.getReturnsListInRange(
                    another,
                    subStartDate,
                    subEndDate
                  );
                  subChartData = {
                    data: subOneReturns.map((subOneReturn, index) => {
                      return {
                        x: subOneReturn,
                        y: subAnotherReturns[index]
                      };
                    }),
                    xLabel: nameOfOne,
                    yLabel: nameOfAnother
                  };
                }

                return (
                  <AssetCorrelationPresenter
                    data={data}
                    client={client}
                    result={result}
                    chartData={chartData}
                    oneReturns={oneReturns}
                    anotherReturns={anotherReturns}
                    startDate={startDate}
                    endDate={endDate}
                    subChartData={subChartData}
                    corrcoeff={corrcoeff}
                  />
                );
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}

export default AssetCorrelationContainer;
