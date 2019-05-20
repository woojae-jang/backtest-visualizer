import { Market } from "../market";
import * as math from "mathjs";

const market = new Market("20160101");

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

  // 최근 t개월 수익률 - 최근 1개월 수익률
  static getMomentum3 = (code, date, t = 30) => {
    const oneMonthReturns = Analyst.getMomentum1(code, date, 20);
    const threeMonthReturns = Analyst.getMomentum1(code, date, 60);
    return threeMonthReturns - oneMonthReturns;
  };

  // 평균 모멘텀 스코어 systrader79
  static getMomentum4 = (code, date) => {
    const curPriceList = market.getHistoricalPriceListFromDate(code, date, 241);

    const pickedPriceList = [];
	  const recentMonthList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    recentMonthList.forEach(t => {
      const curIdx = curPriceList.length - 1;
      // price[`D-${t * 20}`] = curPriceList[curIdx - t * 20];
	const price = curPriceList[curIdx - t * 20];
		pickedPriceList.push(price);
    });

	  const curPrice = pickedPriceList[0]
	  
	const momentumScoreList = pickedPriceList.slice(1,pickedPriceList.length).map(price => {
		  if(curPrice > price) return 1;
		else return 0;
	  })
	
	const meanOfmomentumScore = math.sum(momentumScoreList) / 12;
    
  	return meanOfmomentumScore;
  };
}

const func = () => {
  const sampleCode = "232080";
  const sampleDate = "20170601";
  const result = Analyst.getMomentum4(sampleCode, sampleDate);
  console.log(result);
};

setTimeout(() => func(), 2000);

export { Analyst };
