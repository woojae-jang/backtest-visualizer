import * as vis from "vis";
import { tradingDateList, assetCodeList } from "./data";
import { price_data } from "market";

var options = {};
var dataSet = new vis.DataSet(options);

let idx = 1;

assetCodeList.forEach(code => {
  tradingDateList.forEach(date => {
    const price = price_data[code]["close_price"][date];
    dataSet.add({ id: idx, code, date, price });
    idx += 1;
  });
});

var result = dataSet.get({
  filter: item => {
    const { code, date } = item;
    return code === "069500" && date === "20190405";
  }
});

console.log(result);
