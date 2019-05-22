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
        <Button type="default" onClick={() => this.setTestPeriod(client)}>
          TestPeriod
        </Button>
        <Button type="default" onClick={() => this.setTestPeriod2(client)}>
          TestPeriod2
        </Button>
        <Button type="default" onClick={() => this.setStartDate(client)}>
          최초일({tradingDateList[0]})
        </Button>
        <Button type="default" onClick={() => this.setEndDate(client)}>
          최종일({tradingDateList[tradingDateList.length - 1]})
        </Button>
        <Button type="default" onClick={() => this.setGAPS2018(client)}>
          GAPS 2018
        </Button>
        <Button type="default" onClick={() => this.setGAPS2017(client)}>
          GAPS 2017
        </Button>
        <Button type="default" onClick={() => this.setGAPS2016(client)}>
          GAPS 2016
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

  setTestPeriod = client => {
    const startDate = "20160701";
    const endDate = tradingDateList[tradingDateList.length - 1];
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

  setTestPeriod2 = client => {
    const startDate = "20170403";
    const endDate = tradingDateList[tradingDateList.length - 1];
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

  setGAPS2018 = client => {
    const startDate = "20180601";
    const endDate = "20181031";
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

  setGAPS2017 = client => {
    const startDate = "20170601";
    const endDate = "20171031";
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

  setGAPS2016 = client => {
    const startDate = "20160601";
    const endDate = "20161031";
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
