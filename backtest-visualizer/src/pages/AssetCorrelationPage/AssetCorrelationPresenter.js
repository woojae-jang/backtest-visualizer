import React from "react";
import MarketCalendar from "components/MarketCalendar";
import CorrelationChart from "./CorrelationChart";
import CompareAssetsSelect from "./CompareAssetsSelect";
import CorTrendChart from "./CorTrendChart";

const AssetCorrelationPresenter = props => {
  const {
    data,
    client,
    result,
    chartData,
    oneReturns,
    anotherReturns,
    startDate,
    endDate,
    subChartData,
    corrcoeff
  } = props;

  console.log(corrcoeff);
  return (
    <div>
      <div className="asset-allocation-page">
        <CompareAssetsSelect data={result.data} client={client} />
        <CorrelationChart data={chartData} />
        <CorTrendChart
          oneReturns={oneReturns}
          anotherReturns={anotherReturns}
          startDate={startDate}
          endDate={endDate}
          client={client}
        />
        {subChartData ? <CorrelationChart data={subChartData} /> : null}
      </div>
    </div>
  );
};

export default AssetCorrelationPresenter;
