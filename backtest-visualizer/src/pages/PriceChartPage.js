import React from "react";
import Chart from "chart.js";
import { Market } from "../market";
import { dynamicColors } from "../utils/chartUtil";

const market = new Market("20161207");
// console.log(market.getPctChange("232080"));

class PriceChartPage extends React.Component {
  render() {
    return (
      <div id="chart">
        <h1>PriceChart</h1>
        <canvas id="line-chart" width="800" height="450" />
      </div>
    );
  }

  componentDidMount() {
    const codeList = [
      "069500",
      "232080",
      "143850",
      "195930",
      "238720",
      "192090",
      "148070",
      "136340",
      "182490",
      "132030",
      "130680",
      "114800",
      "138230",
      "139660",
      "130730"
    ];
    const price_data = market.getCumPctChange("232080");

    const dataList = [];
    for (let i = 0; i < codeList.length; i++) {
      const price_data = market.getCumPctChange(codeList[i]);
      let dataset = {};
      dataset.data = price_data;
      dataset.label = codeList[i];
      dataList.push(dataset);
    }

    // console.log(price_data);
    // price_data.pctChange
    const labels = price_data.dateList;
    this._create_chart(dataList, labels);
  }
  _create_chart(price_data = [], labels = []) {
    const colors = [dynamicColors(), dynamicColors()];
    const datasets = [];
    // const datasets = [
    //   {
    //     label: "My First dataset",
    //     backgroundColor: colors[0],
    //     borderColor: colors[0],
    //     data: price_data,
    //     fill: false
    //   },
    //   {
    //     label: "My Second dataset",
    //     fill: false,
    //     backgroundColor: colors[1],
    //     borderColor: colors[1],
    //     data: [2, 1, 3, 2, 4, 7, 9, 6]
    //   }
    // ];

    price_data.map((data, index) => {
      const dataset = {
        label: data.label,
        backgroundColor: colors[index],
        borderColor: colors[index],
        data: data.data.pctChange,
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
        title: {
          display: true,
          text: "Chart.js Line Chart"
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
      }
    };

    this.chart = new Chart(document.getElementById("line-chart"), config);
  }
}

export default PriceChartPage;
