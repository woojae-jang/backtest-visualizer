import React from "react";
import AssetAllocationChart from "./AssetAllocationChart";
import MarketCalendar from "components/MarketCalendar";
import SelectInput from "components/SelectInput";
import ResultTable from "./ResultTable";
import ReturnsChart from "components/ReturnsChart";
import DoughnutChart from "components/DoughnutChart";
import { Button } from "antd";
import WeightsInputTable2 from "components/WeightsInputTable2";

const AssetAllocationPresenter = props => {
  const {
    data,
    client,
    table,
    handleOnClick,
    handlePlayClick,
    handleResetClick,
    stopSimulation,
    stateData
  } = props;

  return (
    <div>
      <div className="asset-allocation-page">
        <SelectInput data={data} client={client} />
        {table ? <ResultTable data={table} /> : null}
        {/* <WeightsInputTable2 data={data} client={client} /> */}
        <Button type="primary" onClick={e => handleOnClick(e, data)}>
          Run
        </Button>
        <Button onClick={e => handlePlayClick(e, data)}>Play</Button>
        <Button onClick={stopSimulation}>Stop</Button>
        <Button type="danger" onClick={handleResetClick}>
          Reset
        </Button>
        <AssetAllocationChart
          data={stateData}
          fixedAllocation={table}
          client={client}
        />
        <ReturnsChart data={data} />
        <DoughnutChart data={data} />
      </div>
    </div>
  );
};

export default AssetAllocationPresenter;
