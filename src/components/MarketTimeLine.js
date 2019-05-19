import React from "react";
import Timeline from "react-visjs-timeline";
import { Button } from "antd";
import * as moment from "moment";
import { tradingDateList } from "utils/data";
import { addOneDay } from "utils/utils";

class MarketTimeLine extends React.Component {
  render() {
    const { startDate, endDate } = this.props.data;

    const _startDate = moment(startDate, "YYYYMMDD").toDate();
    const _endDate = moment(endDate, "YYYYMMDD").toDate();
    const _minDate = moment("20160110", "YYYYMMDD").toDate();
    const _maxDate = moment("20190510", "YYYYMMDD").toDate();

    // const hiddenDates;

    // tradingDateList.forEach(tradingDate =>{

    // })

    const options = {
      editable: {
        updateTime: true
      },
      orientation: {
        axis: "top"
      },
      min: _minDate,
      max: _maxDate,
      zoomMin: 1000 * 60 * 60 * 24 * 4, // 4 day  최소 4일 해야 시간값 안나옴
      zoomMax: 1000 * 60 * 60 * 24 * 365 * 10, // about 10 year
      height: "130px",
      showCurrentTime: true,

      hiddenDates: [
        {
          start: "2016-01-02 00:00:00",
          end: "2016-01-04 00:00:00",
          repeat: "weekly"
        }
      ]
    };
    const items = [
      {
        id: "validRange",
        start: _startDate,
        end: _endDate
      }
    ];

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

  componentDidUpdate() {
    this.timeline.itemsData.on("*", this._itemUpdataHandler);
  }

  _fit = () => {
    const timeline = this.timeline;

    timeline.fit();
  };

  _itemUpdataHandler = (event, properties, senderId) => {
    const { items, data } = properties;
    const client = this.props.client;

    items.forEach((item, index) => {
      if (item === "validRange") {
        const itemData = data[index];
        const { start, end } = itemData;

        const startDate = moment(start).format("YYYYMMDD");
        const endDate = moment(end).format("YYYYMMDD");

        if (
          tradingDateList.indexOf(startDate) === -1 ||
          tradingDateList.indexOf(endDate) === -1
        )
          return;

        client.writeData({
          data: {
            globalVariables: {
              __typename: "GlobalVariables",
              startDate,
              endDate
            }
          }
        });
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
export default MarketTimeLine;
