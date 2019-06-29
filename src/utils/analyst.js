import { Market } from "../market";
import * as math from "mathjs";
import * as jStat from "jStat";

const market = new Market("20160101");

class Analyst {
  // 최근 3개월 수익률
  static getMomentum1 = (code, date, window = 60, excludeCurrentDay=true) => {
    // '데이터 미리보기' 오류를 피하기 위해 조회날짜의 전날 까지의 데이터만 접근
    // window + 1
    // length - 2

	  if(excludeCurrentDay){
		      const curPriceList = market.getHistoricalPriceListFromDate(
      code,
      date,
      Number(window) + 1
    );

    const startPrice = curPriceList[0];
    const endPrice = curPriceList[curPriceList.length - 2];

    const returns = (endPrice - startPrice) / startPrice;
    return returns;
	  }
	  else {
		      const curPriceList = market.getHistoricalPriceListFromDate(
      code,
      date,
      Number(window)
    );

    const startPrice = curPriceList[0];
    const endPrice = curPriceList[curPriceList.length - 1];

    const returns = (endPrice - startPrice) / startPrice;
    return returns;
	  }

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

    const curPrice = pickedPriceList[0];

    const momentumScoreList = pickedPriceList
      .slice(1, pickedPriceList.length)
      .map(price => {
        if (curPrice > price) return 1;
        else return 0;
      });

    const meanOfmomentumScore = math.sum(momentumScoreList) / 12;

    return meanOfmomentumScore;
  };

  static getCorrEff = (returns1, returns2) => {
    return jStat.corrcoeff(returns1, returns2);
  };

  static getCorMatrix = (codeList, date, window) => {
    // '데이터 미리보기' 오류를 피하기 위해 조회날짜의 전날 까지의 데이터만 접근
    // window + 1
    // 마지막 날짜 pop() 으로 빼줌

    const listOfPriceList = codeList.map(code => {
      const returns = market.getHistoricalReturnsFromDate(
        code,
        date,
        Number(window) + 1
      );
      returns.pop();
      return returns;
    });

    const corList = [];
    for (let i = 0; i < codeList.length; i++) {
      let row = {};
      row[""] = codeList[i];
      for (let j = 0; j < codeList.length; j++) {
        const corrcoeff = jStat.corrcoeff(
          listOfPriceList[i],
          listOfPriceList[j]
        );
        row[codeList[j]] = corrcoeff.toString();
      }
      corList.push(row);
    }

    corList["columns"] = [""].concat(codeList);
    return corList;
  };

  static getCorScore = (codeList, date, window) => {
    const corMatrix = Analyst.getCorMatrix(codeList, date, window);
    const corScoreList = corMatrix.map(rows => {
      const thisCode = rows[""];
      delete rows[""];

      const keys = Object.keys(rows);
      // 자신을 제외한 상관계수 리스트
      const corList = keys.filter(key => key != thisCode).map(key => rows[key]);
      return math.sum(corList);
    });
    return corScoreList;
  };

  static getStd = (code, date, wondow) => {
    // '데이터 미리보기' 오류를 피하기 위해 조회날짜의 전날 까지의 데이터만 접근
    // window + 1
    // 마지막 날짜 pop() 으로 빼줌
    const returns = market.getHistoricalReturnsFromDate(code, date, wondow + 1);
    returns.pop();
    return math.std(returns);
  };
}

const func = () => {
  const sampleCode = "232080";
  const sampleDate = "20170601";
  // const result = Analyst.getMomentum4(sampleCode, sampleDate);
  const result1 = Analyst.getStd(sampleCode, sampleDate, 60);
  const result2 = Analyst.getCorMatrix(
    [sampleCode, "069500", "143850"],
    sampleDate,
    60
  );
  const result3 = Analyst.getCorScore(
    [sampleCode, "069500", "143850"],
    sampleDate,
    60
  );
  console.log(result1);
  console.log(result2);
  console.log(result3);
};

// setTimeout(() => func(), 2000);

export { Analyst };
