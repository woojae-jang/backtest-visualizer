import React from "react";
import Timeline from "react-visjs-timeline";
import { Button } from "antd";
import { tradingDateList } from "utils/data";

// git star 분석 페이지
// https://app.astralapp.com

const options = {
  editable: {
    updateTime: true
  },
  // clickToUse: true,

  // limit of visible range
  min: new Date(2016, 1, 10),
  max: new Date(2019, 5, 10),

  // limit of zoom
  zoomMin: 1000 * 60 * 60 * 24 * 4, // 4 day  최소 4일 해야 시간값 안나옴
  zoomMax: 1000 * 60 * 60 * 24 * 365 * 10 // about 10 year

  // width: "100%",
  // height: "60px",
  // stack: false,
  // showMajorLabels: true,
  // showCurrentTime: true,
  // zoomMin: 1000000,
  // type: "background",
  // format: {
  //   minorLabels: {
  //     minute: "h:mma",
  //     hour: "ha"
  //   }
  // }
};

const items = [
  {
    start: new Date(2017, 7, 15),
    end: new Date(2018, 8, 2) // end is optional
  }
  // {
  //   start: new Date(2010, 7, 15),
  //   end: new Date(2010, 8, 2),
  //   type: "background",
  //   style: "background-color: blue;"
  // }
];

const addOneDay = _date => {
  const year = _date.slice(0, 4);
  const month = _date.slice(4, 6);
  const day = _date.slice(6, 8);

  const date = new Date(year, month, day);
  console.log(date);

  const newDate = new Date();
  const tomorrow = newDate.setTime(date.getTime() + 86400000); // 86400000 하루 ms

  console.log(tomorrow);
};

addOneDay("20190408");

tradingDateList.forEach(tradingDay => {
  const year = tradingDay.slice(0, 4);
  const month = tradingDay.slice(4, 6);
  const day = tradingDay.slice(6, 8);

  const date = new Date(year, month, day);

  items.push({
    start: date,
    end: date,
    type: "background",
    style: "background-color: blue;"
  });
});

class Example1 extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Timeline ref="timeline" options={options} items={items} />
        <Button type="default" onClick={this._fit}>
          fit
        </Button>
      </React.Fragment>
    );
  }

  _fit = () => {
    const timeline = this.refs.timeline.$el;
    timeline.fit();
  };
}
export default Example1;
