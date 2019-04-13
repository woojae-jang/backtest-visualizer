import DataFrame from "dataframe-js";
import { tradingDateList, assetCodeList } from "./data";
import { priceData } from "priceData";

// From a collection (easier)
const df = new DataFrame(
  [
    { c1: 1, c2: 6 }, // <------- A row
    { c4: 1, c3: 2 }
  ],
  ["c1", "c2", "c3", "c4"]
);

// console.log(df);

const data = [];
assetCodeList.forEach(code => {
  tradingDateList.forEach(date => {
    data.push([code, date, priceData[code][date]]);
  });
});

// console.log(data);

const df2 = new DataFrame(data, ["code", "date", "price"]);

// console.log(df2);

// df2.sql.register("tmp2");
DataFrame.sql.registerTable(df2, "tmp2");
// Request on Table
const table = DataFrame.sql.request("SELECT * FROM tmp2 WHERE code='069500'");
console.log(table);
