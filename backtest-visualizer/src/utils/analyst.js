import { Market } from "../market";

const market = new Market("20160101");

const sampleCode = "069500";
const sampleDate = "20160801";
const sampleCount = 80;

// setTimeout(() => func(), 2000);

class Analyst {
  // 최근 3개월 수익률
  static getMomentum1 = (code, date, window = 60) => {
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

  // 최근 1,3,6개월 평균수익률
  static getMomentum2 = (code, date) => {
    const oneMonthReturns = Analyst.getMomentum1(code, date, 20);
    const threeMonthReturns = Analyst.getMomentum1(code, date, 60);
    const sixMonthReturns = Analyst.getMomentum1(code, date, 120);
    return (oneMonthReturns + threeMonthReturns + sixMonthReturns) / 3;
  };
}

const func = () => {
  //   const result = market.getHistoricalPriceListFromDate(sampleCode, sampleDate);
  //   console.log(result);
  const result = Analyst.getMomentum1(sampleCode, sampleDate);
  console.log(result);
};

export { Analyst };
