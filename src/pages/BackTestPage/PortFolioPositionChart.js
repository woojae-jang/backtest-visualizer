import React from "react";
import { Market } from "market";
import * as math from "mathjs";
import * as $ from "jquery";
import { dynamicColors } from "utils/chartUtil";
import { schemeCategory10 } from "d3-scale-chromatic";
import { Doughnut } from "react-chartjs-2";
import { getAssetShortName } from "utils/data";

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
      const color = index < 10 ? schemeCategory10[index] : dynamicColors();

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

    return <Doughnut data={data} />;
  }
}

export default PortFolioPositionChart;
