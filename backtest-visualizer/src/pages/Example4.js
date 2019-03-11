import React, { Component } from "react";
import Chart from "chart.js";

class AssetAllocationChart extends Component {
  render() {
    return (
      <div id="chart">
        chart.js chart exam
        <canvas id="scatter-chart" width="800" height="450" />
      </div>
    );
  }
  componentDidMount() {
    this._create_chart();
  }

  _create_chart() {
    this.chart = new Chart(document.getElementById("scatter-chart"), {
      type: "scatter",
      data: {
        labels: [],
        datasets: [
          {
            label: "Scatter Dataset",
            data: [{ x: 10, y: 20 }, { x: 15, y: 0 }],
            backgroundColor: "rgb(255, 99, 132)"
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: "linear",
              position: "bottom"
            }
          ]
        }
      }
    });
  }
}

export default AssetAllocationChart;
