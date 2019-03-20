import React, { Component } from "react";
import ResultTable from "../components/ResultTable";
import WeightsInputTable from "../components/WeightsInputTable";

class AssetAllocationChart extends Component {
  render() {
    return (
      <div>
        <ResultTable />
        <WeightsInputTable />
      </div>
    );
  }
}

export default AssetAllocationChart;
