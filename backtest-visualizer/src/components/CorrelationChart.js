import React from "react";
import { Scatter } from "react-chartjs-2";
import regression from "regression";
import { getLineDataFromEquation } from "utils/chartUtil";

class CorrelationChart extends React.Component {
  render() {
    const { data, xLabel, yLabel } = this.props.data;
    const result = regression.linear(
      data.map(point => {
        return [point.x, point.y];
      })
    );
    const gradient = result.equation[0];
    const yIntercept = result.equation[1];
    const lineData = getLineDataFromEquation(gradient, yIntercept);

    const chartData = {
      datasets: [
        {
          type: "scatter",
          data,
          backgroundColor: "#FF6384",
          hoverBackgroundColor: "#FF6384",
          showLine: false,
          label: "scatter"
        },
        {
          type: "line",
          data: lineData,
          backgroundColor: "black",
          hoverBackgroundColor: "black",
          fill: false,
          label: "line"
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

    return (
      <Scatter data={chartData} options={options} width={700} height={700} />
    );
  }
}

export default CorrelationChart;
