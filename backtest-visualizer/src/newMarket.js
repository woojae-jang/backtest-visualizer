import * as vis from "vis";
import priceData from "priceData";
import { tradingDateList, assetCodeList } from "utils/data";

const options = {};
const dataSet = new vis.DataSet(options);

let id = 1;
assetCodeList.forEach(code => {
  tradingDateList.forEach(date => {
    const price = priceData[code][date];
    dataSet.add({ id, code, date, price });
    id += 1;
  });
});

export class Market {
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

    return result[0].price;
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

export default Market;
