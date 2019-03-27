import React from "react";
import { Doughnut } from "react-chartjs-2";
import { assetNameList } from "utils/data";

class DoughnutChart extends React.Component {
  render() {
    const { selectedAllocation } = this.props.data.globalVariables;

    const data = {
      labels: assetNameList,
      datasets: [
        {
          data: selectedAllocation,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
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
