import React from "react";
import { Doughnut } from "react-chartjs-2";
import { assetNameList } from "utils/data";
import { schemePaired } from "d3-scale-chromatic";

assetNameList.push("현금");

class DoughnutChart extends React.Component {
  render() {
    const { selectedAllocation } = this.props.data.globalVariables;

    const data = {
      labels: assetNameList,
      datasets: [
        {
          data: selectedAllocation,
          backgroundColor: schemePaired,
          hoverBackgroundColor: schemePaired
        }
      ]
    };

    const options = {
      animation: {
        animateScale: true
      },
      legend: {
        position: "left"
      }
    };

    return <Doughnut data={data} options={options} width={600} height={250} />;
  }
}

export default DoughnutChart;
