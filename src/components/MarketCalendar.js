import React from "react";
import { DatePicker } from "antd";
import * as moment from "moment";
import { tradingDateList } from "../utils/data";
import { Button } from "antd";
import MarketTimeLine from "./MarketTimeLine";

const { RangePicker } = DatePicker;

const dateFormat = "YYYYMMDD";

const periodStore = {
  testPeriod: {
    startDate: "20160701",
    endDate: tradingDateList[tradingDateList.length - 1]
  },
  testPeriod2: {
    startDate: "20170403",
    endDate: tradingDateList[tradingDateList.length - 1]
  },
  testPeriod3: {
    startDate: "20161004",
    endDate: "20190516"
  },
  GAPS2019: {
    startDate: "20190603",
    endDate: tradingDateList[tradingDateList.length - 1]
  },
  GAPS2018: {
    startDate: "20180601",
    endDate: "20181031"
  },
  GAPS2017: {
    startDate: "20170601",
    endDate: "20171031"
  },
  GAPS2016: {
    startDate: "20160601",
    endDate: "20161031"
  }
};

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
        <Button
          type="default"
          onClick={() => this.setPeriod(client, "testPeriod")}
        >
          TestPeriod
        </Button>
        <Button
          type="default"
          onClick={() => this.setPeriod(client, "testPeriod2")}
        >
          TestPeriod2
        </Button>
        <Button
          type="default"
          onClick={() => this.setPeriod(client, "testPeriod3")}
        >
          TestPeriod3
        </Button>
        <Button type="default" onClick={() => this.setStartDate(client)}>
          최초일({tradingDateList[0]})
        </Button>
        <Button type="default" onClick={() => this.setEndDate(client)}>
          최종일({tradingDateList[tradingDateList.length - 1]})
        </Button>
        <Button
          type="default"
          onClick={() => this.setPeriod(client, "GAPS2019")}
        >
          GAPS 2019
        </Button>
        <Button
          type="default"
          onClick={() => this.setPeriod(client, "GAPS2018")}
        >
          GAPS 2018
        </Button>
        <Button
          type="default"
          onClick={() => this.setPeriod(client, "GAPS2017")}
        >
          GAPS 2017
        </Button>
        <Button
          type="default"
          onClick={() => this.setPeriod(client, "GAPS2016")}
        >
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

  setPeriod = (client, periodType) => {
    const { startDate, endDate } = periodStore[periodType];
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
