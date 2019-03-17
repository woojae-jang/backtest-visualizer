import React, { Component } from "react";
import Chart from "chart.js";

class AssetAllocationChart extends Component {
  render() {
    return (
      <div id="chart">
        <canvas id="scatter-chart" width="800" height="450" />
      </div>
    );
  }
  componentDidMount() {
    this._create_chart();
  }

  componentDidUpdate() {
    this._chartUpdate();
    // if(this.chart !== undefined){
    //     if(this.props.data == "reset"){
    //         this._create_chart();
    //     }
    //     else{
    //         this.add_points(this.props.data);
    //     }
    // }
  }

  _chartUpdate() {
    const points = this.props.data;
    this.add_points(points);
  }

  add_points(points) {
    const labels = points.map(point => {
      const label = point.labels;
      const new_label = label.map(lab => {
        return parseInt(lab);
      });
      return new_label;
    });
    this.chart.data.datasets[0].data = [
      ...this.chart.data.datasets[0].data,
      ...points
    ];
    this.chart.data.labels = [...this.chart.data.labels, ...labels];
    this.chart.update();
  }

  _create_chart() {
    this.chart = new Chart(document.getElementById("scatter-chart"), {
      type: "scatter",
      data: {
        labels: [],
        datasets: [
          {
            label: "Scatter Dataset",
            data: [],
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
        },
        onClick: event => {
          let activePoints = this.chart.getElementAtEvent(event);
          if (activePoints[0]) {
            let index = activePoints[0]._index;
            // console.log(this.chart.data.labels[index]);
            console.log(this.chart.data.datasets[0].data[index]);
            // console.log(this.chart.data.datasets[0].data[index].sharpeRatio);
          }
        }
      }
    });
  }
}

export default AssetAllocationChart;
