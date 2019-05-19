import { tradingDateList } from "./data";
import * as moment from "moment";
import { addOneDay } from "./utils";

// const tradingDates = tradingDateList.map(tradingDate =>
//   moment(tradingDate, "YYYYMMDD").toDate()
// );

const tradingDates = tradingDateList;

// console.log(tradingDates);

class TradingDate {
  static getDateList = (_startDate, _endDate) => {
    const startDate = TradingDate.magnet(_startDate, true);
    const endDate = TradingDate.magnet(_endDate, false);

    const startDateIdx = tradingDates.indexOf(startDate);
    const endDateIdx = tradingDates.indexOf(endDate);

    return tradingDates.slice(startDateIdx, endDateIdx + 1);
  };

  static getNonTradingDateList = (startDate, endDate) => {
    console.log("getNonTradingDateList");
  };

  static magnet = (_date, after = true) => {
    const date = moment(_date).format("YYYYMMDD");

    if (tradingDates.indexOf(date) !== -1) {
      return date;
    }

    let nearDateIdx = null;
    for (let i = 0; i < tradingDates.length; i++) {
      if (tradingDates[i] > date) {
        nearDateIdx = i;
        break;
      }
    }

    if (after) {
      return tradingDates[nearDateIdx];
    } else {
      return tradingDates[nearDateIdx - 1];
    }
  };

  constructor(date) {
    this.date = date;
  }

  addOneDay = () => {};
}

// TradingDate.getDateList(new Date(2017, 1, 5), new Date(2018, 1, 5));
// console.log(TradingDate.magnet(new Date(2017, 1, 5)));
// console.log(TradingDate.magnet(new Date(2017, 1, 5), false));
// console.log(TradingDate.magnet("20170105", false));

export default TradingDate;
