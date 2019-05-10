import React from "react";
import { Market } from "market";
import * as math from "mathjs";
import * as $ from "jquery";
import Chart from "chart.js";
import { dynamicColors } from "utils/chartUtil";
import { schemeCategory10 } from "d3-scale-chromatic";
import { Line } from "react-chartjs-2";
import TradingDate from "utils/TradingDate";

const market = new Market("20161207");

class PriceChart extends React.Component {
  render() {
    const { startDate, endDate } = this.props.data.globalVariables;
    const resultList = this.props.resultList;

    const dataList = [];

    for (let i = 0; i < resultList.length; i++) {
      let price_data = resultList[i].result.cumReturnList;
      let dataset = {};
      dataset.data = price_data;
      dataset.label = resultList[i].name;
      dataList.push(dataset);
    }

    const labels = TradingDate.getDateList(startDate, endDate);

    const datasets = [];
    dataList.forEach((data, index) => {
      const color = index < 10 ? schemeCategory10[index] : dynamicColors();
      const dataset = {
        label: data.label,
        backgroundColor: color,
        borderColor: color,
        data: data.data.map(num => math.round(num, 2)),
        fill: false
      };
      datasets.push(dataset);
    });

    const data = {
      labels: labels,
      datasets
    };

    const options = {
      responsive: true,
      title: {
        display: true,
        text: "asset's returns"
      },
      tooltips: {
        mode: "index",
        intersect: false
      },
      hover: {
        mode: "nearest",
        intersect: true
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Date"
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Return(%)"
            }
          }
        ]
      }
    };
    return <Line data={data} options={options} />;
  }
}

export default PriceChart;
