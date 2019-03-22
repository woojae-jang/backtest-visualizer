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
    console.log(this.props);
    this._create_chart();
    this._fixedAllocation();
  }

  componentDidUpdate() {
    if (this.props.fixedAllocation) {
      this._fixedAllocation();
    }
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

  _fixedAllocation() {
    const allocations = this.props.fixedAllocation;
    this.chart.data.datasets.map((datasets, index) => {
      if (datasets.label === "Fixed Allocation") {
        this.chart.data.datasets[index].data = allocations.map(alloc => {
          console.log(alloc);
          return { x: alloc.std, y: alloc.returns, code: alloc.code };
        });
      }

      return null;
    });

    this.chart.update();
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

    this.chart.data.datasets.map((datasets, index) => {
      if (datasets.label === "Random Allocation") {
        this.chart.data.datasets[index].data = [
          ...this.chart.data.datasets[index].data,
          ...points
        ];
      }

      return null;
    });

    this.chart.data.labels = [...this.chart.data.labels, ...labels];
    console.log(points);
    this.chart.update();
  }

  _create_chart() {
    this.chart = new Chart(document.getElementById("scatter-chart"), {
      type: "scatter",
      data: {
        labels: [],
        datasets: [
          {
            label: "Fixed Allocation",
            data: [],
            backgroundColor: "rgb(0, 99, 132)"
          },

          {
            label: "Random Allocation",
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
            console.log(this.chart.data.datasets[1].data[index]);
            // console.log(this.chart.data.datasets[0].data[index].sharpeRatio);
          }
        }
      }
    });
  }
}

export default AssetAllocationChart;
