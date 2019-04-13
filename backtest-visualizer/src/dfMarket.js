import DataFrame from "dataframe-js";
import { tradingDateList, assetCodeList } from "utils/data";
import { priceData } from "priceData";

const dataSet = new DataFrame(
  assetCodeList.map(code => {
    return priceData[code];
  }),
  tradingDateList
);

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
    const result = dataSet.get({
      filter: item => {
        const { code, date } = item;
        return code === _code && date === this.date;
      },
      fields: ["price"]
    });

    const price = result[0].price;
    return price;
  }

  getPriceList(_code) {
    const result = dataSet.get({
      filter: item => {
        const { code } = item;
        return code === _code;
      },
      order: (item1, item2) => {
        // date 오름차순
        if (item1.date > item2.date) {
          return 1;
        }
      },
      fields: ["price", "date"]
    });

    // console.log(result);
    return result.map(obj => obj.price);
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
    const result = dataSet.get({
      filter: item => {
        const { code, date } = item;
        return code === _code && (date >= _startDate && date <= _endDate);
      },
      order: (item1, item2) => {
        // date 오름차순
        if (item1.date > item2.date) {
          return 1;
        }
      },
      fields: ["price"]
    });

    return result.map(obj => obj.price);
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
