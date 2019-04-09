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

  orientation: {
    axis: "top"
  },

  // limit of visible range
  min: new Date(2016, 1, 10),
  max: new Date(2019, 5, 10),

  // limit of zoom
  zoomMin: 1000 * 60 * 60 * 24 * 4, // 4 day  최소 4일 해야 시간값 안나옴
  zoomMax: 1000 * 60 * 60 * 24 * 365 * 10, // about 10 year

  // width: "100%",
  height: "100px",
  // stack: false,
  // showMajorLabels: true,
  showCurrentTime: true
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
    id: "validRange",
    start: new Date(2017, 7, 15),
    end: new Date(2018, 8, 2) // end is optional
  }
];

const addOneDay = date => {
  const tomorrow = new Date();
  tomorrow.setTime(date.getTime() + 86400000); // 86400000 하루 ms
  return tomorrow;
};

tradingDateList.forEach(tradingDay => {
  const year = tradingDay.slice(0, 4);
  const month = tradingDay.slice(4, 6);
  const day = tradingDay.slice(6, 8);

  const date = new Date(year, month, day);

  items.push({
    start: date,
    end: addOneDay(date),
    type: "background",
    style: "background-color: #7fb0ff;"
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
        <Button type="default" onClick={this._createCustomTime}>
          create custom time
        </Button>
        <Button type="default" onClick={this._play}>
          play
        </Button>
        <Button type="default" onClick={this._stop}>
          stop
        </Button>
        <Button type="default" onClick={this._reset}>
          reset
        </Button>
        <Button type="default" onClick={this._show}>
          show data
        </Button>
      </React.Fragment>
    );
  }

  componentDidMount() {
    const timeline = this.refs.timeline.$el;
    const customTimeId = "id";

    this.timeline = timeline;
    this.customTimeId = customTimeId;

    timeline.itemsData.on("*", this._itemUpdataHandler);
  }

  _fit = () => {
    const timeline = this.timeline;

    timeline.fit();
  };

  _itemUpdataHandler = (event, properties, senderId) => {
    const { items, data } = properties;

    items.forEach((item, index) => {
      if (item === "validRange") {
        const itemData = data[index];
        const { start, end } = itemData;
        console.log(start);
        console.log(end);
      }
    });
  };

  _show = () => {
    const timeline = this.timeline;
    console.log(timeline);
    // console.log(timeline.items);
    console.log(timeline.options);
  };

  _createCustomTime = () => {
    const timeline = this.timeline;
    const id = this.customTimeId;

    timeline.addCustomTime("2017-10-20 13:00:00", id);
  };

  _play = () => {
    this.intervalId = setInterval(this._addOneDayToCustomTime, 100);
  };

  _stop = () => {
    clearInterval(this.intervalId);
  };

  _reset = () => {
    const timeline = this.timeline;
    const id = this.customTimeId;

    timeline.removeCustomTime(id);
  };

  _addOneDayToCustomTime = () => {
    const timeline = this.timeline;
    const id = this.customTimeId;

    const customTime = timeline.getCustomTime(id);
    const newCustomTime = addOneDay(customTime);
    timeline.setCustomTime(newCustomTime, id);
  };
}
export default Example1;
