import React from "react";
import Chart from "chart.js";
import { Market } from "../market";
import { dynamicColors } from "../utils/chartUtil";
import * as math from "mathjs";
import * as $ from "jquery";
import "./PriceChartPage.css";
import { GET_GLOBAL_VARIABLES } from "../apollo/queries";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import { Query } from "react-apollo";
import * as moment from "moment";

const { RangePicker } = DatePicker;

const market = new Market("20161207");

class PriceChart extends React.Component {
  render() {
    return (
      <div className="chart__container">
        <canvas id="cursor" width="800" height="450" />
        <canvas id="line-chart" width="800" height="450" />
      </div>
    );
  }

  componentDidUpdate() {
    const codeList = [
      "069500",
      "232080",
      "143850"
      // "195930",
      // "238720",
      // "192090",
      // "148070",
      // "136340",
      // "182490",
      // "132030",
      // "130680",
      // "114800",
      // "138230",
      // "139660",
      // "130730"
    ];

    const dataList = [];

    const { startDate, endDate } = this.props;
    console.log("componentDidUpdate");
    console.log("this.props");
    console.log(this.props);
    console.log(startDate, endDate);

    for (let i = 0; i < codeList.length; i++) {
      let price_data = market.getCumPctChangeInRange(
        codeList[i],
        startDate,
        endDate
      );
      console.log(price_data);

      let dataset = {};
      dataset.data = price_data;
      dataset.label = codeList[i];
      dataList.push(dataset);
    }

    console.log(dataList);

    const priceData = market.getCumPctChangeInRange(
      "232080",
      startDate,
      endDate
    );
    const labels = priceData.dateList;

    const colors = [dynamicColors(), dynamicColors()];
    const datasets = [];
    dataList.map((data, index) => {
      const dataset = {
        label: data.label,
        backgroundColor: colors[index],
        borderColor: colors[index],
        data: data.data.pctChange.map(num => math.round(num, 2)),
        fill: false
      };
      datasets.push(dataset);
      return null;
    });

    // const data = {
    //   labels: labels,
    //   datasets
    // };

    this.chart.labels = labels;
    this.chart.datasets = datasets;
    // console.log(data);
    console.log("datasets");
    console.log(datasets);

    console.log("this.chart.datasets");
    console.log(this.chart.datasets);
    this.chart.update();
  }

  componentDidMount() {
    const codeList = [
      "069500",
      "232080",
      "143850"
      // "195930",
      // "238720",
      // "192090",
      // "148070",
      // "136340",
      // "182490",
      // "132030",
      // "130680",
      // "114800",
      // "138230",
      // "139660",
      // "130730"
    ];

    const dataList = [];

    const { startDate, endDate } = this.props;
    console.log(this.props);
    console.log(startDate, endDate);

    for (let i = 0; i < codeList.length; i++) {
      let price_data = market.getCumPctChangeInRange(
        codeList[i],
        startDate,
        endDate
      );
      let dataset = {};
      dataset.data = price_data;
      dataset.label = codeList[i];
      dataList.push(dataset);
    }

    const priceData = market.getCumPctChangeInRange(
      "232080",
      startDate,
      endDate
    );
    const labels = priceData.dateList;

    console.log(dataList, labels);
    this._create_chart(dataList, labels);
  }

  _create_chart(price_data = [], labels = []) {
    const colors = [dynamicColors(), dynamicColors()];
    const datasets = [];
    price_data.map((data, index) => {
      const dataset = {
        label: data.label,
        backgroundColor: colors[index],
        borderColor: colors[index],
        data: data.data.pctChange.map(num => math.round(num, 2)),
        fill: false
      };
      datasets.push(dataset);
      return null;
    });

    const data = {
      labels: labels,
      datasets
    };

    const config = {
      type: "line",
      data: data,
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Chart.js Line Chart"
        },
        tooltips: {
          mode: "index",
          intersect: false
        },
        hover: {
          mode: "nearest",
          intersect: true
        },
        onHover: event => {
          const element = $("#cursor");
          const offsetLeft = element.offset().left;
          const domElement = element.get(0);
          const clientX = parseInt(event.clientX - offsetLeft);
          const ctx = element.get(0).getContext("2d");
          ctx.clearRect(0, 0, domElement.width, domElement.height);
          ctx.beginPath();
          ctx.moveTo(clientX, 0);
          ctx.lineTo(clientX, domElement.height);
          ctx.setLineDash([10, 10]);
          ctx.strokeStyle = "#333";
          ctx.stroke();
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Date"
              }
            }
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Return(%)"
              }
            }
          ]
        }
      }
    };

    this.chart = new Chart(document.getElementById("line-chart"), config);
  }
}

const dateFormat = "YYYYMMDD";

class PriceChartPage extends React.Component {
  onChnage = (date, client) => {
    const startDate = date[0].format(dateFormat);
    const endDate = date[1].format(dateFormat);
    client.writeData({
      data: {
        globalVariables: {
          __typename: "GlobalVariables",
          startDate,
          endDate
        }
      }
    });
  };

  render() {
    return (
      <div id="chart">
        <h1>PriceChart</h1>
        <Query query={GET_GLOBAL_VARIABLES}>
          {({ loading, error, data, client }) => {
            const { startDate, endDate } = data.globalVariables;
            return (
              <div>
                <RangePicker
                  onChange={date => this.onChnage(date, client)}
                  defaultValue={[
                    moment(startDate, dateFormat),
                    moment(endDate, dateFormat)
                  ]}
                  format={dateFormat}
                />
                <PriceChart startDate={startDate} endDate={endDate} />
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default PriceChartPage;
