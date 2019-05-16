import { Market } from "../market";

const market = new Market("20160101");

const sampleCode = "069500";
const sampleDate = "20160801";
const sampleCount = 80;

// setTimeout(() => func(), 2000);

class Analyst {
  // 최근 3개월 수익률
  static getMomentum1 = (code, date, window=60) => {
    const curPriceList = market.getHistoricalPriceListFromDate(
      code,
      date,
      window
    );

    const startPrice = curPriceList[0];
    const endPrice = curPriceList[curPriceList.length - 1];

    const returns = (endPrice - startPrice) / startPrice;
    return returns;
  };
}

const func = () => {
  //   const result = market.getHistoricalPriceListFromDate(sampleCode, sampleDate);
  //   console.log(result);
  const result = Analyst.getMomentum1(sampleCode, sampleDate);
  console.log(result);
};

export { Analyst };
