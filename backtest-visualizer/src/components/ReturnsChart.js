import React from "react";
import { Market } from "../market";
import * as math from "mathjs";
import * as $ from "jquery";
import Chart from "chart.js";
import { dynamicColors } from "../utils/chartUtil";
import { getCumPctChange } from "../utils/utils";
import { BackTest, BackTestArgsHandler } from "utils/simulation";

const market = new Market("20161207");

class ReturnsChart extends React.Component {
  render() {
    this._run();
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
    const { startDate, endDate } = this.props.data.globalVariables;

    const priceData = market.getCumPctChangeInRange(
      "232080",
      startDate,
      endDate
    );
    const labels = priceData.dateList;

    const cumPctChange = this._run();

    const color = dynamicColors();
    const data = {
      labels: labels,
      datasets: [
        {
          backgroundColor: color,
          borderColor: color,
          data: cumPctChange,
          fill: false
        }
      ]
    };

    this.chart.data = data;
    this.chart.update();
  }

  _run() {
    const {
      startDate,
      endDate,
      selectedAllocation
    } = this.props.data.globalVariables;

    if (selectedAllocation == false) {
      return;
    }

    const backTestArgsHandler = new BackTestArgsHandler();
    backTestArgsHandler.replaceAllocation(selectedAllocation);
    backTestArgsHandler.setDateRange(startDate, endDate);

    const testArgs = backTestArgsHandler.getArgs();
    const backTest = new BackTest();
    backTest.init(testArgs);
    backTest.run();
    backTest.createMetaData();
    const result = backTest.result();

    return getCumPctChange(result.navList);
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

  _create_chart() {
    const cumPctChange = this._run();

    const { startDate, endDate } = this.props.data.globalVariables;
    const priceData = market.getCumPctChangeInRange(
      "232080",
      startDate,
      endDate
    );
    const labels = priceData.dateList;

    const color = dynamicColors();
    const data = {
      labels: labels,
      datasets: [
        {
          // label: data.label,
          backgroundColor: color,
          borderColor: color,
          data: cumPctChange,
          fill: false
        }
      ]
    };

    const config = {
      type: "line",
      data: data,
      options: {
        animation: {
          duration: false
        },
        responsive: true,
        title: {
          display: true,
          text: "Portfolio Returns"
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

export default ReturnsChart;
