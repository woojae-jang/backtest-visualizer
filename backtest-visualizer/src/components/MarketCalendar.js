import React from "react";
import { DatePicker } from "antd";
import * as moment from "moment";
import { tradingDateList } from "../utils/data";
import { Button } from "antd";
import MarketTimeLine from "./MarketTimeLine";

const { RangePicker } = DatePicker;

const dateFormat = "YYYYMMDD";

class MarketCalendar extends React.Component {
  render() {
    const { client, data } = this.props;
    const { startDate, endDate } = data.globalVariables;
    return (
      <React.Fragment>
        <RangePicker
          onChange={date => this.onChange(date, client)}
          value={[moment(startDate, dateFormat), moment(endDate, dateFormat)]}
          format={dateFormat}
          disabledDate={this.disabledDate}
        />
        <Button type="default" onClick={() => this.setStartDate(client)}>
          최초일
        </Button>
        <Button type="default" onClick={() => this.setEndDate(client)}>
          최종일
        </Button>
        {/* <MarketTimeLine data={{ startDate, endDate }} client={client} /> */}
      </React.Fragment>
    );
  }

  onChange = (date, client) => {
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

  setStartDate = client => {
    const startDate = tradingDateList[0];
    client.writeData({
      data: {
        globalVariables: {
          __typename: "GlobalVariables",
          startDate
        }
      }
    });
  };

  setEndDate = client => {
    const endDate = tradingDateList[tradingDateList.length - 1];
    client.writeData({
      data: {
        globalVariables: {
          __typename: "GlobalVariables",
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
