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
      animation: {
        animateScale: true
      },
      legend: {
        position: "left"
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: yLabel
            }
          }
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: xLabel
            }
          }
        ]
      }
    };

    return <Scatter data={data} options={options} width={600} height={250} />;
  }
}

export default CorrelationChart;
