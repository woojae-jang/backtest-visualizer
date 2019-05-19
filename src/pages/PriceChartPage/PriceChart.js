import React from "react";
import { Market } from "market";
import * as math from "mathjs";
import * as $ from "jquery";
import Chart from "chart.js";
import { dynamicColors } from "utils/chartUtil";
import { schemeCategory10 } from "d3-scale-chromatic";

const market = new Market("20161207");

class PriceChart extends React.Component {
  render() {
    return (
      <div className="chart__container">
        <canvas id="cursor" width="800" height="450" />
        <canvas id="line-chart" width="800" height="450" />
      </div>
    );
  }

  componentDidUpdate() {
    this.chartUpdate();
  }

  chartUpdate() {
    const { startDate, endDate, codeList } = this.props.data.globalVariables;

    const dataList = [];

    for (let i = 0; i < codeList.length; i++) {
      let price_data = market.getCumPctChangeInRange(
        codeList[i],
        startDate,
        endDate
      );
      let dataset = {};
      dataset.data = price_data;
      dataset.label = codeList[i];
      dataList.push(dataset);
    }

    const priceData = market.getCumPctChangeInRange(
      "232080",
      startDate,
      endDate
    );
    const labels = priceData.dateList;

    // same colors
    const colors = this.chart.data.datasets.map(dataset => dataset.borderColor);
    const datasets = [];
    dataList.map((data, index) => {
      const newColor = dynamicColors();
      const dataset = {
        label: data.label,
        backgroundColor: colors[index] ? colors[index] : newColor,
        borderColor: colors[index] ? colors[index] : newColor,
        data: data.data.pctChange.map(num => math.round(num, 2)),
        fill: false
      };
      datasets.push(dataset);
      return null;
    });

    const data = {
      labels: labels,
      datasets
    };
    this.chart.data = data;
    this.chart.update();
  }

  componentDidMount() {
    const { startDate, endDate, codeList } = this.props.data.globalVariables;

    const dataList = [];

    for (let i = 0; i < codeList.length; i++) {
      let price_data = market.getCumPctChangeInRange(
        codeList[i],
        startDate,
        endDate
      );
      let dataset = {};
      dataset.data = price_data;
      dataset.label = codeList[i];
      dataList.push(dataset);
    }

    const priceData = market.getCumPctChangeInRange(
      "232080",
      startDate,
      endDate
    );
    const labels = priceData.dateList;

    this._create_chart(dataList, labels);
  }

  _create_chart(price_data = [], labels = []) {
    const datasets = [];
    price_data.map((data, index) => {
      const color = index < 10 ? schemeCategory10[index] : dynamicColors();
      const dataset = {
        label: data.label,
        backgroundColor: color,
        borderColor: color,
        data: data.data.pctChange.map(num => math.round(num, 2)),
        fill: false
      };
      datasets.push(dataset);
      return null;
    });

    const data = {
      labels: labels,
      datasets
    };

    const config = {
      type: "line",
      data: data,
      options: {
        responsive: true,
        // title: {
        //   display: true,
        //   text: "asset's returns"
        // },
        tooltips: {
          mode: "index",
          intersect: false
        },
        hover: {
          mode: "nearest",
          intersect: true
        },
        onHover: event => {
          const element = $("#cursor");
          const offsetLeft = element.offset().left;
          const domElement = element.get(0);
          const clientX = parseInt(event.clientX - offsetLeft);
          const ctx = element.get(0).getContext("2d");
          ctx.clearRect(0, 0, domElement.width, domElement.height);
          ctx.beginPath();
          ctx.moveTo(clientX, 0);
          ctx.lineTo(clientX, domElement.height);
          ctx.setLineDash([10, 10]);
          ctx.strokeStyle = "#333";
          ctx.stroke();
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
      }
    };

    this.chart = new Chart(document.getElementById("line-chart"), config);
  }
}

export default PriceChart;
