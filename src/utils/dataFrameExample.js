import DataFrame from "dataframe-js";
import { tradingDateList, assetCodeList } from "./data";
import { priceData } from "priceData";

const data = [];
assetCodeList.forEach(code => {
  tradingDateList.forEach(date => {
    data.push([code, date, priceData[code][date]]);
  });
});

const df2 = new DataFrame(data, ["code", "date", "price"]);

DataFrame.sql.registerTable(df2, "tmp2");

const _code = "069500";
const QUERY = `SELECT price FROM tmp2 WHERE code='${_code}' AND date='20190405'`;
const res = DataFrame.sql.request(QUERY);
console.log(res);
console.log(res.toArray().map(d => d[0]));
