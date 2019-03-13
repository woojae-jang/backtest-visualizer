import React from "react";
import Chart from "chart.js";

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
    this._create_chart();
  }
  _create_chart() {
    const config = {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July"
        ],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: "red",
            borderColor: "red",
            data: [1, 3, 2, 5, 7, 9, 7],
            fill: false
          },
          {
            label: "My Second dataset",
            fill: false,
            backgroundColor: "blue",
            borderColor: "blue",
            data: [2, 1, 3, 2, 4, 7, 9, 6]
          }
        ]
      },
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
                labelString: "Price"
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
