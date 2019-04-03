import React from "react";
import { Scatter } from "react-chartjs-2";

class CorrelationChart extends React.Component {
  render() {
    const { xLabel, yLabel } = this.props.data;

    const data = {
      datasets: [
        {
          data: this.props.data.data,
          backgroundColor: "#FF6384",
          hoverBackgroundColor: "#FF6384"
        }
      ]
    };

    const options = {
      animation: false,
      legend: {
        display: false
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: yLabel
            },
            ticks: {
              min: -3,
              max: 3
            }
          }
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: xLabel
            },
            ticks: {
              min: -3,
              max: 3
            }
          }
        ]
      }
    };

    return <Scatter data={data} options={options} width={700} height={700} />;
  }
}

export default CorrelationChart;
