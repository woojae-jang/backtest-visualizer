import React from "react";
import { DatePicker } from "antd";
import * as moment from "moment";
import { tradingDateList } from "../utils/data";

const { RangePicker } = DatePicker;

const dateFormat = "YYYYMMDD";

class MarketCalendar extends React.Component {
  render() {
    const { client, data } = this.props;
    const { startDate, endDate } = data.globalVariables;
    return (
      <RangePicker
        onChange={date => this.onChnage(date, client)}
        defaultValue={[
          moment(startDate, dateFormat),
          moment(endDate, dateFormat)
        ]}
        format={dateFormat}
        disabledDate={this.disabledDate}
      />
    );
  }

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

  disabledDate = currentDate => {
    const date = currentDate.format(dateFormat);
    if (tradingDateList.indexOf(date) === -1) {
      return true;
    } else {
      return false;
    }
  };
}

export default MarketCalendar;
