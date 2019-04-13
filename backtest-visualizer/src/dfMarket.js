import DataFrame from "dataframe-js";
import { tradingDateList, assetCodeList } from "utils/data";
import { priceData } from "priceData";

const data = [];
assetCodeList.forEach(code => {
  tradingDateList.forEach(date => {
    data.push([code, date, priceData[code][date]]);
  });
});

const df = new DataFrame(data, ["code", "date", "price"]);

DataFrame.sql.registerTable(df, "priceTable");

class Market {
  constructor(date) {
    this.date = date;
  }

  setDate(date) {
    this.date = date;
  }

  getCurrentDate() {
    return this.date;
  }

  getPrice(_code) {
    const QUERY = `SELECT price FROM priceTable WHERE code='${_code}' AND date='${
      this.date
    }'`;
    const res = DataFrame.sql.request(QUERY);
    const price = res.toArray()[0];
    return price;
  }

  getPriceList(_code) {
    const QUERY = `SELECT price FROM priceTable WHERE code='${_code}'`;
    const res = DataFrame.sql.request(QUERY);
    const priceList = res.toArray().map(d => d[0]);
    return priceList;
  }

  getPctChange(code) {
    const closePriceList = this.getPriceList(code);
    const pctChangeList = [];

    closePriceList.forEach((price, index) => {
      if (index === 0) return null;

      const prePrice = closePriceList[index - 1];
      const pctChange = ((price - prePrice) / prePrice) * 100;
      pctChangeList.push(pctChange);
    });

    return pctChangeList;
  }

  getCumPctChange(code) {
    const closePriceList = this.getPriceList(code);
    const cumPctChangeList = [];

    const basePrice = closePriceList[0];
    closePriceList.forEach(price => {
      const pctChange = ((price - basePrice) / basePrice) * 100;
      cumPctChangeList.push(pctChange);
    });

    return cumPctChangeList;
  }

  getPriceListInRange(_code, _startDate, _endDate) {
    const QUERY = `SELECT price FROM priceTable WHERE code='${_code}' AND date>= ${_startDate} AND date<=${_endDate}`;
    const res = DataFrame.sql.request(QUERY);
    const priceList = res.toArray().map(d => d[0]);
    return priceList;
  }

  getReturnsListInRange(code, startDate, endDate) {
    const closePriceList = this.getPriceListInRange(code, startDate, endDate);

    const returnsList = [];

    closePriceList.forEach((price, index) => {
      if (index === 0) return null;

      const prePrice = closePriceList[index - 1];
      const pctChange = ((price - prePrice) / prePrice) * 100;
      returnsList.push(pctChange);
    });

    return returnsList;
  }

  getCumPctChangeInRange(code, startDate, endDate) {
    const closePriceList = this.getPriceListInRange(code, startDate, endDate);
    const cumPctChangeList = [];

    const basePrice = closePriceList[0];
    closePriceList.forEach(price => {
      const pctChange = ((price - basePrice) / basePrice) * 100;
      cumPctChangeList.push(pctChange);
    });

    return cumPctChangeList;
  }
}

export { Market };
