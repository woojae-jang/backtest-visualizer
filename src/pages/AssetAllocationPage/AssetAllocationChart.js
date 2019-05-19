import React, { Component } from "react";
import { Scatter } from "react-chartjs-2";

class AssetAllocationChart extends Component {
  render() {
    const allocations = this.props.fixedAllocation;
    const fixedAllocationData = allocations.map(alloc => {
      return {
        x: alloc.annualizedStd,
        y: alloc.annualizedReturns,
        code: alloc.code
      };
    });

    const points = this.props.data;
    const labels = points.map(point => point.labels.map(lab => parseInt(lab)));

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Fixed Allocation",
          data: fixedAllocationData,
          backgroundColor: "rgb(0, 99, 132)"
        },

        {
          label: "Random Allocation",
          data: points,
          backgroundColor: "rgb(255, 99, 132)"
        }
      ]
    };
    const options = {
      scales: {
        xAxes: [
          {
            type: "linear",
            position: "bottom",
            ticks: {
              min: 0
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              min: -0.2
            }
          }
        ]
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const { index, datasetIndex } = tooltipItem;
            let label = null;
            if (datasetIndex === 0) {
              label = data.datasets[0].data[index].code;
            } else {
              label = data.labels[tooltipItem.index];
            }

            return (
              label +
              " : (" +
              tooltipItem.xLabel +
              ", " +
              tooltipItem.yLabel +
              ")"
            );
          }
        }
      }
    };

    return (
      <Scatter
        data={data}
        options={options}
        width={300}
        height={150}
        getElementAtEvent={this.handleGetElementAtEvent}
      />
    );
  }

  handleGetElementAtEvent = elem => {
    const activePoints = elem;
    const { client } = this.props;

    if (activePoints[0]) {
      const { _datasetIndex, _index, _chart } = activePoints[0];
      const point = _chart.data.datasets[_datasetIndex].data[_index];

      if (point !== null && point.labels !== undefined) {
        client.writeData({
          data: {
            globalVariables: {
              __typename: "GlobalVariables",
              selectedAllocation: point.labels
            }
          }
        });
      }
    }
  };
}

export default AssetAllocationChart;
