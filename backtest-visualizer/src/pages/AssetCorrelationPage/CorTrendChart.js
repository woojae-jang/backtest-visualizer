import React from "react";
import { dynamicColors } from "utils/chartUtil";
import { getMovingCor } from "utils/utils";
import { Line } from "react-chartjs-2";
import { Market } from "market";

const market = new Market("20161207");

const windowList = [20, 60, 120, 240, 360, 480];

class CorTrendChart extends React.Component {
  render() {
    const { oneReturns, anotherReturns, startDate, endDate } = this.props;

    const priceData = market.getCumPctChangeInRange(
      "232080",
      startDate,
      endDate
    );
    const labels = priceData.dateList;

    const datasets = [];
    windowList.forEach(days => {
      let data = getMovingCor(oneReturns, anotherReturns, days);
      for (let i = 0; i < days; i++) {
        data.unshift(NaN);
      }

      const color = dynamicColors();
      const dataset = {
        label: days + "Moving",
        backgroundColor: color,
        borderColor: color,
        data: data,
        fill: false
      };
      datasets.push(dataset);
    });

    const data = {
      labels,
      datasets
    };

    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              min: -1,
              max: 1
            }
          }
        ]
      }
    };

    return (
      <Line
        data={data}
        options={options}
        getElementAtEvent={this.handleGetElementAtEvent}
      />
    );
  }

  handleGetElementAtEvent = elem => {
    const activePoints = elem;
    const { client } = this.props;

    if (activePoints.length !== 0) {
      const { _datasetIndex, _index, _chart } = activePoints[0];

      const labelOfDatasets = _chart.data.labels[_index];
      const labelOfData = _chart.data.datasets[_datasetIndex].label;

      const baseDate = labelOfDatasets;
      const rolling = parseInt(labelOfData);

      client.writeData({
        data: {
          correlationPage: {
            __typename: "CorrelationPage",
            rolling: rolling,
            baseDate: baseDate
          }
        }
      });
    }
  };
}

export default CorTrendChart;
