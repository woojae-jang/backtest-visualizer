import React from "react";
import { Market } from "../market";
import * as $ from "jquery";
import Chart from "chart.js";
import { dynamicColors } from "../utils/chartUtil";
import { getStdMovingAvg } from "utils/utils";

const market = new Market("20161207");

const windowList = [20, 60, 120, 240, 360, 480];

class RiskChart extends React.Component {
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
    const {
      startDate,
      endDate,
      selectedCode
    } = this.props.data.globalVariables;

    const code = selectedCode;

    const pctChange = market.getReturnsListInRange(code, startDate, endDate);

    const priceData = market.getCumPctChangeInRange(
      "232080",
      startDate,
      endDate
    );
    const labels = priceData.dateList;

    const datasets = [];
    const daysList = windowList;
    const colors = this.chart.data.datasets.map(dataset => dataset.borderColor);
    // const hidden = this.chart.data.datasets.map((dataset,index) => {
    //   let meta = this.chart.getDatasetMeta(index);
    // }
    // );
    // console.log(hidden);
    daysList.forEach((days, index) => {
      const newColor = dynamicColors();
      let data = getStdMovingAvg(pctChange, days);
      for (let i = 0; i < days; i++) {
        data.unshift(NaN);
      }
      const dataset = {
        label: days + "MA",
        backgroundColor: colors[index] ? colors[index] : newColor,
        borderColor: colors[index] ? colors[index] : newColor,
        data: data,
        fill: false
      };
      datasets.push(dataset);
    });

    const data = {
      labels: labels,
      datasets
    };

    this.chart.data = data;
    this.chart.update();
  }

  componentDidMount() {
    const {
      startDate,
      endDate,
      selectedCode
    } = this.props.data.globalVariables;

    const code = selectedCode;

    const pctChange = market.getReturnsListInRange(code, startDate, endDate);

    const priceData = market.getCumPctChangeInRange(
      "232080",
      startDate,
      endDate
    );
    const labels = priceData.dateList;

    this._create_chart(pctChange, labels);
  }

  _create_chart(pctChange = [], labels = []) {
    const datasets = [];
    const daysList = windowList;
    daysList.forEach(days => {
      let data = getStdMovingAvg(pctChange, days);
      for (let i = 0; i < days; i++) {
        data.unshift(NaN);
      }

      const color = dynamicColors();
      const dataset = {
        label: days + "MA",
        backgroundColor: color,
        borderColor: color,
        data: data,
        fill: false
      };
      datasets.push(dataset);
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
        title: {
          display: true,
          text: "Standard Deviation Moving Avg"
        },
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
                labelString: "Standard Deviation(%)"
              }
            }
          ]
        }
      }
    };

    this.chart = new Chart(document.getElementById("line-chart"), config);
  }
}

export default RiskChart;
