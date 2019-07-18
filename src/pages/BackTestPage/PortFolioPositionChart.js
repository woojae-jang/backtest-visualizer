import React from "react";
import { schemeCategory20 } from "utils/chartUtil";
import { Doughnut } from "react-chartjs-2";
import { getAssetShortName, getAssetId } from "utils/data";

class PortFolioPositionChart extends React.Component {
  render() {
    const { resultList, portInfo } = this.props;

    if (portInfo == null) return <Doughnut data={{}} />;

    const { name, date } = portInfo;

    const portfolioResult = resultList.filter(result => result.name === name)[0]
      .result;

    const dateIdx = portfolioResult.dateList.indexOf(date);
    const allocation = portfolioResult.allocationList[dateIdx];

    const labels = [];
    const _data = [];
    const _color = [];

    if (allocation === undefined) {
      return null;
    }
    allocation.forEach((asset, index) => {
      if (asset.weight === 0) return;

      const assetIndex = getAssetId(asset.code);
      const color = schemeCategory20[assetIndex];

      if (asset.code !== "cash") {
        labels.push(getAssetShortName(asset.code));
      } else {
        labels.push("cash");
      }

      _data.push(asset.weight);
      _color.push(color);
    });

    const data = {
      labels,
      datasets: [
        {
          data: _data,
          backgroundColor: _color,
          hoverBackgroundColor: _color
        }
      ]
    };

    const options = {
      legend: {
        position: "left"
      }
    };

    return <Doughnut data={data} options={options} />;
  }
}

export default PortFolioPositionChart;
