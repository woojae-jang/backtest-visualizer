import React from "react";
import "antd/dist/antd.css";
// import "utils/dataframeExample";
// import "utils/visDataSetExample";
import { Market as newMarket } from "newMarket";
import { Market as oldMarket } from "market";

const market = new newMarket("20190401");
const market2 = new oldMarket("20190401");

// console.log(market2.getPrice("069500"));
// console.log(market.getPrice("069500"));
// // getPrice 같음

var iterations = 5;
console.time("Function #1");
for (var i = 0; i < iterations; i++) {
  market2.getPrice("069500");
}
console.timeEnd("Function #1");

console.time("Function #2");
for (var i = 0; i < iterations; i++) {
  market.getPrice("069500");
}
console.timeEnd("Function #2");

// console.log(market2.getPriceList("069500"));
// console.log(market.getPriceList("069500"));
// // 이전: {date1: price1, date2: price2, ...}
// // 이후: [price, price2, ...]

// console.log(market2.getPctChange("069500"));
// console.log(market.getPctChange("069500"));
// console.log(market2.getCumPctChange("069500"));
// console.log(market.getCumPctChange("069500"));
// console.log(market2.getPriceListInRange("069500", "20190301", "20190401"));
// console.log(market.getPriceListInRange("069500", "20190301", "20190401"));

console.log(market2.getReturnsListInRange("069500", "20190301", "20190401"));
console.log(market.getReturnsListInRange("069500", "20190301", "20190401"));
// 이전:
// 이후:

// console.log(market2.getCumPctChangeInRange("069500", "20190301", "20190401"));
// console.log(market.getCumPctChangeInRange("069500", "20190301", "20190401"));

class Example5 extends React.Component {
  render() {
    return (
      <div>
        <h1>Example5</h1>
      </div>
    );
  }
}
export default Example5;
