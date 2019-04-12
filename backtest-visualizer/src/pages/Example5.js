import React from "react";
import "antd/dist/antd.css";
// import "utils/dataframeExample";
// import "utils/visDataSetExample";
import Market from "newMarket";

const market = new Market("20190401");

console.log(market.getPrice("069500"));
console.log(market.getPriceList("069500"));
console.log(market.getPctChange("069500"));
console.log(market.getCumPctChange("069500"));
console.log(market.getPriceListInRange("069500", "20190301", "20190401"));
console.log(market.getReturnsListInRange("069500", "20190301", "20190401"));
console.log(market.getCumPctChangeInRange("069500", "20190301", "20190401"));

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
