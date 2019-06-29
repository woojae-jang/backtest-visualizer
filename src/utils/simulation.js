import { Market } from "market";
import * as math from "mathjs";
import { tradingDateList, assetCodeList } from "utils/data";
import { getAnnualizedReturns, getAnnualizedStd, toRank } from "utils/utils";
import { Analyst } from "utils/analyst";
import * as Strategy from "core/strategy";

const SEED_MONEY = 10000000000;
// const COMMISION_RATE = 0.015 / 100;
const COMMISION_RATE = 0 / 100;
const TAX_RATE = 0;
// const TAX_RATE = 0.3 / 100;

class PortFolio {
  constructor(date, seedMoney = SEED_MONEY) {
    this.date = date;
    this.cash = seedMoney;
    this.assets = {};
    this.log = [];
    this.market = new Market(date);
  }

  setDate(date) {
    this.date = date;
    this.market.setDate(date);
  }

  getCurrentAllocation() {
    const curAlloc = [];
    const NAV = this.valuation();
    const assetsNames = this.getAssetsNames();
    assetsNames.map(assetName => {
      const code = assetName;
      const amount = this.assets[assetName];
      const price = this.market.getPrice(code);
      const assetValue = amount * price;
      const weight = (assetValue / NAV) * 100;
      curAlloc.push({ code: code, weight: weight });
      return null;
    });

    curAlloc.push({ code: "cash", weight: (this.cash / NAV) * 100 });

    return curAlloc;
  }

  orderableAmount(cash, price) {
    return Math.floor(cash / price);
  }

  order(code, amount) {
    if (amount > 0) {
      this.buy(code, amount);
    } else {
      this.sell(code, -amount);
    }
  }

  buyValidation(requiredCash) {
    if (this.cash > requiredCash) {
      return true;
    } else {
      return false;
    }
  }

  buy(code, amount) {
    const price = this.market.getPrice(code);

    const cashForAsset = price * amount;
    const commision = price * amount * COMMISION_RATE;
    const requiredCash = cashForAsset + commision;

    if (this.buyValidation(requiredCash)) {
      this.executeBuy(code, amount, requiredCash);
      const log =
        "date " +
        this.date +
        " buy " +
        code +
        " " +
        price +
        " " +
        amount +
        " shares";
      this.log.push(log);
    } else {
      console.log("reject buy order");
    }
  }

  executeBuy(code, amount, requiredCash) {
    this.cash -= requiredCash;
    if (this.assets[code] === undefined) {
      this.assets[code] = amount;
    } else {
      this.assets[code] += amount;
    }
  }

  sell(code, amount) {
    const price = this.market.getPrice(code, this.date);
    const liquidatedCash = price * amount;
    const commision = price * amount * COMMISION_RATE;
    const tax = price * amount * TAX_RATE;
    const cash = liquidatedCash - commision - tax;

    this.assets[code] -= amount;
    this.cash += cash;

    const log =
      "date " +
      this.date +
      " sell " +
      code +
      " " +
      price +
      " " +
      amount +
      " shares";
    this.log.push(log);
  }

  rebalance(newAllocation) {}

  executeAllocation(newAllocation) {
    const orderList = [];

    let totalWeight = 0;
    newAllocation.map(asset => {
      const code = asset.code;
      const weight = asset.weight;
      totalWeight += weight;

      if (code === "cash") return null;

      let maximumAmount = null;
      if (weight === 0) {
        maximumAmount = 0;
      } else {
        const orderableMoney = this.weightToValue(weight);
        const price = this.market.getPrice(code);
        maximumAmount = this.orderableAmount(orderableMoney, price);
      }

      const curAmount = this.assets[code] === undefined ? 0 : this.assets[code];
      const amountDelta = maximumAmount - curAmount;

      const order = { code: code, amount: amountDelta };
      orderList.push(order);
      return null;
    });

    // 결과값이 99.999999 인 경우 핸들링 위해 반올림 하였음
    if (Math.round(totalWeight) !== 100) {
      console.log(totalWeight);
      // eslint-disable-next-line no-throw-literal
      throw "total weight is not 100";
    }

    // 수수료 현금확보를 위해 매도 -> 매수 순서로

    const sellOrders = orderList.filter(order => order.amount < 0);
    const buyOrders = orderList.filter(order => order.amount > 0);

    sellOrders.map(order => this.order(order.code, order.amount));
    buyOrders.map(order => this.order(order.code, order.amount));
  }

  weightToValue(weight) {
    // eslint-disable-next-line no-throw-literal
    if (weight === 0) throw "weight can't be 0";

    const NAV = this.valuation();

    // // weight 5% 가감
    // weight *= 0.95;

    return (NAV / 100) * weight;
  }

  valuation() {
    const assetsNames = this.getAssetsNames();
    let NAV = this.cash;
    assetsNames.map(name => {
      const price = this.market.getPrice(name, this.date);
      const amount = this.assets[name];
      NAV += price * amount;
      return null;
    });
    return NAV;
  }

  getAssetsNames() {
    return Object.keys(this.assets);
  }

  print() {
    console.log(this.assets);
  }
}

// context 의 값들은 ref 여야함

const afterMarket = context => {
  const { backtest, portfolio } = context;
  const { date } = backtest;

  const NAV = portfolio.valuation();
  const shortLog = "date: " + date + " NAV: " + NAV;
  const curAllocation = portfolio.getCurrentAllocation();

  backtest.dailyLog.push(shortLog);
  backtest.navList.push(NAV);
  backtest.allocationList.push(curAllocation);
  backtest.dateList.push(date);
};

const shouldTrade = context => {
  const { backtest } = context;
  const { date } = backtest;
  const rebalanceDay = backtest.rebalanceDateList.indexOf(date);
  if (rebalanceDay !== -1) {
    return true;
  } else {
    return false;
  }
};

const intraMarket = (context, strategy) => {
  strategy(context);
};

class BackTest {
  afterMarket = () => {
    const NAV = this.portfolio.valuation();
    const shortLog = "date: " + this.date + " NAV: " + NAV;
    const curAllocation = this.portfolio.getCurrentAllocation();

    this.dailyLog.push(shortLog);
    this.navList.push(NAV);
    this.allocationList.push(curAllocation);
    this.dateList.push(this.date);
  };

  shouldTrade = () => {
    const rebalanceDay = this.rebalanceDateList.indexOf(this.date);
    if (rebalanceDay !== -1) {
      return true;
    } else {
      return false;
    }
  };

  constructor() {
    this.startDate = null;
    this.endDate = null;
    this.date = null;
    this.dateIndex = null;
    this.portfolio = null;
    this.rebalanceDateList = null;
    this.fixedAlloc = null;
    this.navList = null;
    this.returnList = null;
    this.orderLog = null;
    this.eventLog = null;
  }

  init(backTestInfo) {
    const { startDate, endDate, rebalanceDateList, allocation } = backTestInfo;
    this.startDate = startDate;
    this.endDate = endDate;
    this.date = startDate;
    this.dateIndex = tradingDateList.indexOf(this.date);
    this.portfolio = new PortFolio(startDate);
    this.rebalanceDateList = rebalanceDateList;
    this.fixedAlloc = allocation;
    this.navList = [];
    this.returnList = [];
    this.dateList = [];
    this.allocationList = [];
    this.orderLog = [];
    this.eventLog = [];
    this.dailyLog = [];
  }

  result() {
    const result = {};

    result["navList"] = this.navList;
    result["returnList"] = this.returnList;
    result["cumReturnList"] = this.cumReturnList;
    result["allocationList"] = this.allocationList;
    result["dateList"] = this.dateList;
    result["orderLog"] = this.orderLog;
    result["eventLog"] = this.eventLog;

    result["finalReturn"] = this.getFinalReturn();
    result["annualizedReturns"] = this.getAnnualizedReturns();
    result["annualizedStd"] = this.getAnnualizedStd();
    result["sharpeRatio"] = this.getSharpeRatio();

    result["std"] = this.getStd();

    return result;
  }

  getFinalReturn() {
    const prevPrice = this.navList[0];
    const aftPrice = this.navList[this.navList.length - 1];
    const finalReturn = (aftPrice - prevPrice) / prevPrice;
    return finalReturn;
  }

  getAnnualizedReturns() {
    const returns = this.getFinalReturn();
    const days = this.navList.length - 1;
    return getAnnualizedReturns(returns, days);
  }

  getAnnualizedStd() {
    const std = this.getStd();
    return getAnnualizedStd(std);
  }

  getSharpeRatio() {
    const sharpeRatio = this.getAnnualizedReturns() / this.getAnnualizedStd();
    return sharpeRatio;
  }

  getStd() {
    let newReturnList = this.returnList.map(returns => returns / 100);
    // let newReturnList = this.returnList.map(returns => returns);
    newReturnList.shift();
    const std = math.std(newReturnList);
    return std;
  }

  forwardDate(days = 1) {
    this.dateIndex += days;
    if (this.dateIndex >= tradingDateList.length) {
      // eslint-disable-next-line no-throw-literal
      throw "dateIndex out of range";
    }
    this.date = tradingDateList[this.dateIndex];
    this.portfolio.setDate(this.date);
  }

  fixedAllocation(allocation) {
    this.allocation = allocation;
  }

  setRebalanceDateList(dateList) {
    this.rebalanceDateList = dateList;
  }

  run() {
    const context = {
      backtest: this,
      portfolio: this.portfolio
    };

    this.portfolio.executeAllocation(this.fixedAlloc);
    while (true) {
      if (shouldTrade(context)) {
        this.portfolio.executeAllocation(this.fixedAlloc);
      }
      afterMarket(context);

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run2(simulationArgs) {
    const codeList = assetCodeList;
    const allocation = new PortfolioAllocation();

    const context = {
      backtest: this,
      portfolio: this.portfolio,
      allocation,
      codeList,
      simulationArgs
    };

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    while (true) {
      if (shouldTrade(context)) {
        intraMarket(context, Strategy.strategy2);
      }
      afterMarket(context);

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run3(simulationArgs) {
    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const codeList = assetCodeList;
    const stockCodeList = codeList.slice(0, 6);

    const allocation = new PortfolioAllocation();

    const context = {
      backtest: this,
      portfolio: this.portfolio,
      allocation,
      codeList,
      stockCodeList,
      simulationArgs
    };

    while (true) {
      if (this.shouldTrade()) {
        intraMarket(context, Strategy.strategy3);
      }
      this.afterMarket();

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run4(backtestArgs) {
    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const codeList = assetCodeList;
    const stockCodeList = codeList.slice(0, 6);
    const allocation = new PortfolioAllocation();
    const context = {
      backtest: this,
      portfolio: this.portfolio,
      allocation,
      codeList,
      stockCodeList,
      simulationArgs: backtestArgs
    };

    while (true) {
      if (this.shouldTrade()) {
        intraMarket(context, Strategy.strategy4);
      }
      this.afterMarket();

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run5(backTestArgs) {
    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const codeList = assetCodeList;
    const stockCodeList = codeList.slice(0, 6);
    const allocation = new PortfolioAllocation();
    const context = {
      backtest: this,
      portfolio: this.portfolio,
      allocation,
      codeList,
      stockCodeList,
      simulationArgs: backTestArgs
    };
    while (true) {
      if (this.shouldTrade()) {
        intraMarket(context, Strategy.strategy5);
      }
      this.afterMarket();

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  // run6
  // 모멘텀 점수 : 1,3,6개월 평균수익률
  // 리밸런싱 날, 주식지수 6개중 모멘텀 점수가 높은 top개 지수를 100/top 씩 (동일비중)
  run6(top = 2) {
    // 모멘텀 점수 : 1,3,6개월 평균수익률
    // 리밸런싱 날, 주식지수 6개중 모멘텀 점수가 높은 top개 지수를 100/top 씩 (동일비중)

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const codeList = assetCodeList;
    const stockCodeList = codeList.slice(0, 6);
    const allocation = new PortfolioAllocation();
    while (true) {
      if (this.shouldTrade()) {
        allocation.reset();
        const scoreList = [];

        stockCodeList.forEach((code, index) => {
          const momentumScore = Analyst.getMomentum2(code, this.date);
          scoreList.push(momentumScore);
        });

        const scoreObjList = [];
        stockCodeList.forEach((code, i) => {
          scoreObjList.push({ code, momentumScore: scoreList[i] });
        });

        // 모멘텀 점수 내림차순 정렬
        scoreObjList.sort((a, b) => {
          return b.momentumScore - a.momentumScore;
        });

        const topCodesList = scoreObjList.slice(0, top).map(d => d.code);
        const equalWeight = 100 / top;

        topCodesList.forEach(code => {
          allocation.addWeight(code, equalWeight);
        });

        const newAllocation = allocation.getAllocation();
        this.portfolio.executeAllocation(newAllocation);
      }
      this.afterMarket();

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  // run7
  // 모멘텀 점수 : 최근 momentumWindow 거래일 수익률
  // 리밸런싱 날, 우선적으로 절대모멘텀 점수로 필터링
  // 필터링된 주가지수 n개
  // n 의 크기에 따라 주식:채권,달러 비중 결정 (채권은 하이일드)
  // absScore 절대모멘텀 필터 점수
  run7(momentumWindow = 60, absScore = 0) {
    // 모멘텀 점수 : 최근 momentumWindow 거래일 수익률
    // 리밸런싱 날, 우선적으로 절대모멘텀 점수로 필터링
    // 필터링된 주가지수 n개
    // n 의 크기에 따라 주식:채권,달러 비중 결정 (채권은 하이일드)
    // absScore 절대모멘텀 필터 점수

    // 채권
    const bondCode = "182490";
    const dollarCode = "138230";

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const codeList = assetCodeList;
    const stockCodeList = codeList.slice(0, 6);
    const allocation = new PortfolioAllocation();
    while (true) {
      if (this.shouldTrade()) {
        allocation.reset();
        const scoreList = [];

        stockCodeList.forEach((code, index) => {
          const momentumScore = Analyst.getMomentum1(
            code,
            this.date,
            momentumWindow
          );
          scoreList.push(momentumScore);
        });

        const scoreObjList = [];
        stockCodeList.forEach((code, i) => {
          scoreObjList.push({ code, momentumScore: scoreList[i] });
        });

        // 절대모멘텀 충족 필터
        const filterdCodeList = scoreObjList
          .filter(d => d.momentumScore > absScore)
          .map(d => d.code);

        const numOfFilterdCode = filterdCodeList.length;

        const weightOfOneDiv = Math.floor(100 / stockCodeList.length);

        const weightOfStock = weightOfOneDiv * numOfFilterdCode;
        const weightOfBond = (100 - weightOfStock) / 2;
        const weightOfDollar = (100 - weightOfStock) / 2;

        filterdCodeList.forEach(code => {
          allocation.addWeight(code, weightOfOneDiv);
        });
        allocation.add(bondCode, weightOfBond);
        allocation.add(dollarCode, weightOfDollar);

        const newAllocation = allocation.getAllocation();
        this.portfolio.executeAllocation(newAllocation);
      }
      this.afterMarket();

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  // run8
  // 모멘텀 점수 : 최근 momentumWindow 거래일 수익률
  // 리밸런싱 날, 모멘텀 점수가 높은 top개 지수를 100/top 씩 (동일비중)
  run8(top = 1, momentumWindow = 60) {
    // top <= 15
    // 모멘텀 점수 : 최근 momentumWindow 거래일 수익률
    // 리밸런싱 날, 모멘텀 점수가 높은 top개 지수를 100/top 씩 (동일비중)

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const codeList = assetCodeList;
    while (true) {
      if (this.shouldTrade()) {
        const scoreList = [];

        codeList.forEach((code, index) => {
          const momentumScore = Analyst.getMomentum1(
            code,
            this.date,
            momentumWindow
          );
          scoreList.push(momentumScore);
        });

        const scoreObjList = [];
        codeList.forEach((code, i) => {
          scoreObjList.push({ code, momentumScore: scoreList[i] });
        });

        // 모멘텀 점수 내림차순 정렬
        scoreObjList.sort((a, b) => {
          return b.momentumScore - a.momentumScore;
        });

        const topCodesList = scoreObjList.slice(0, top).map(d => d.code);
        const equalWeigth = 100 / top;

        const newAllocation = [...codeList, "cash"].map(code => {
          if (topCodesList.indexOf(code) !== -1) {
            return {
              code,
              weight: equalWeigth
            };
          } else {
            return {
              code,
              weight: 0
            };
          }
        });

        this.portfolio.executeAllocation(newAllocation);
      }
      this.afterMarket();

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run9(momentumWindow, selectedAsset) {
    // 절대모멘텀 점수 : 최근 momentumWindow 거래일 수익률
    // 상승장일경우, 주식 100
    // 하락장일경우, 현금 100

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const codeList = assetCodeList;
    while (true) {
      if (this.shouldTrade()) {
        const momentumScore = Analyst.getMomentum1(
          selectedAsset,
          this.date,
          momentumWindow
        );

        let stockWeight, cashWeight;
        if (momentumScore > 0) {
          stockWeight = 100;
          cashWeight = 0;
        } else {
          stockWeight = 0;
          cashWeight = 100;
        }

        const newAllocation = [...codeList, "cash"].map(code => {
          if (code === selectedAsset) {
            return {
              code,
              weight: stockWeight
            };
          } else if (code === "cash") {
            return {
              code,
              weight: cashWeight
            };
          } else {
            return {
              code,
              weight: 0
            };
          }
        });

        this.portfolio.executeAllocation(newAllocation);
      }
      this.afterMarket();

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run10(momentumWindow, top) {
    // 절대모멘텀 점수 : 최근 momentumWindow 거래일 수익률
    // 세계주가지수를 절대모멘텀으로 두고
    // 주가지수들의 상대모멘텀으로 자산 배분
    // 상승장일경우, 주식 비중 높게
    // 하락장일경우, 주식 비중 낮게

    // GAPS 비중제한 적용하여

    // top=1, 상위 1개가 코스피인 경우 : 코스피20 미국10
    // top=1, 상위 1개가 코스닥인 경우 : 코스닥10 미국10
    // top=1, 상위 1개가 해외인 경우 : 코스피10 해외20

    // top=2, 상위 2개가 코스피,코스닥인 경우 : 코스피20 코스닥10 미국10
    // top=2, 상위 2개가 코스피,해외인 경우 : 코스피20 해외20
    // top=2, 상위 2개가 코스닥,해외인 경우 : 코스닥10 해외20
    // top=2, 상위 2개가 둘다 해외인 경우 : 해외1 20 해외2 20

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const stockCodeList = [
      "069500",
      "232080",
      "143850",
      "195930",
      "238720",
      "192090"
    ];

    const allocation = new PortfolioAllocation();
    while (true) {
      if (this.shouldTrade()) {
        allocation.reset();

        const marketState = Analyst.getMomentum1(
          "WORLD_STOCK",
          this.date,
          momentumWindow
        );

        if (marketState > 0) {
          // 상승장
          const scoreList = [];
          stockCodeList.forEach((code, index) => {
            const momentumScore = Analyst.getMomentum1(
              code,
              this.date,
              momentumWindow
            );
            scoreList.push(momentumScore);
          });

          const scoreObjList = [];
          stockCodeList.forEach((code, i) => {
            scoreObjList.push({ code, momentumScore: scoreList[i] });
          });

          // 모멘텀 점수 내림차순 정렬
          scoreObjList.sort((a, b) => {
            return b.momentumScore - a.momentumScore;
          });

          const topCodesList = scoreObjList.slice(0, top).map(d => d.code);

          if (top == 1) {
            const code = topCodesList[0];
            if (code === "069500") {
              // 코스피
              // 코스피40 미국10
              allocation.addWeight("069500", 20);
              allocation.addWeight("143850", 10);
            } else if (code === "232080") {
              // 코스닥
              // 코스닥20 미국10
              allocation.addWeight("232080", 10);
              allocation.addWeight("143850", 10);
            } else {
              // 해외
              // 코스피10 해외20
              allocation.addWeight("069500", 10);
              allocation.addWeight(code, 20);
            }
          } else if (top == 2) {
            const code1 = topCodesList[0];
            const code2 = topCodesList[1];

            const condition1 = code1 === "069500" || code2 === "069500";
            const condition2 = code1 === "232080" || code2 === "232080";

            if (condition1 && condition2) {
              // 코스피 & 코스닥
              // 코스피20 코스닥20
              // 미국10
              allocation.addWeight("069500", 20);
              allocation.addWeight("232080", 10);
              allocation.addWeight("143850", 10);
            } else if (condition1 || condition2) {
              if (condition1) {
                // 코스피40
                allocation.addWeight("069500", 20);
              } else {
                // 코스닥20
                allocation.addWeight("232080", 10);
              }
              // 미국10
              allocation.addWeight("143850", 10);
            } else {
              //  해외1 20 해외2 20
              allocation.addWeight(code1, 20);
              allocation.addWeight(code2, 20);
            }
          } else {
            console.log(top);
            throw "invalid top arg";
          }
          allocation.addWeight("132030", 5); // 골드 최소비중

          // 남은 비중 중기회사채, 하이일드 배분
          const safetyAssets = ["136340", "182490"];
          const equalWeight =
            allocation.getRemainsWeight() / safetyAssets.length;

          safetyAssets.forEach(code => {
            allocation.addWeight(code, equalWeight);
          });
        } else {
          // 하락장

          // 코스피10 미국10
          allocation.addWeight("069500", 10);
          allocation.addWeight("143850", 10);

          // 남은 비중 채권, 인버스, 달러 배분

          // KOSEF국고채10년                15
          // KBSTAR중기우량회사채           35
          // TIGER단기선진하이일드(합성H)      10
          const bonds = ["148070", "136340", "182490"];
          // const bondsWeights = [15, 35, 10];
          const bondsWeights = [20, 20, 20];

          bonds.forEach((code, index) => {
            allocation.addWeight(code, bondsWeights[index]);
          });

          const safetyAssets = [
            "114800", // KODEX인버스
            "138230" // KOSEF미국달러선물
          ];

          const equalWeight =
            allocation.getRemainsWeight() / safetyAssets.length;

          safetyAssets.forEach(code => {
            allocation.addWeight(code, equalWeight);
          });
        }

        allocation.allocateRemainsWeightToCash();
        const newAllocation = allocation.getAllocation();

        this.portfolio.executeAllocation(newAllocation);
      }
      this.afterMarket();

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run11(top = 1, momentumWindow = 60) {
    // 모멘텀 점수 : 최근 momentumWindow 거래일 수익률
    // 상대모멘텀으로 정렬후 절대모멘텀 충족시 매수
    // 상위 top개

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const allocation = new PortfolioAllocation();
    const codeList = assetCodeList;
    while (true) {
      if (this.shouldTrade()) {
        allocation.reset();
        const scoreObjList = [];
        codeList.forEach((code, index) => {
          const momentumScore = Analyst.getMomentum1(
            code,
            this.date,
            momentumWindow
          );
          scoreObjList.push({ code, momentumScore });
        });

        // 모멘텀 점수 내림차순 정렬
        scoreObjList.sort((a, b) => {
          return b.momentumScore - a.momentumScore;
        });

        const filterdCodeList = scoreObjList
          .filter(asset => asset.momentumScore > 0)
          .map(asset => asset.code)
          .slice(0, top);

        const equalWeight = 30;
        filterdCodeList.forEach(code => {
          allocation.addWeight(code, equalWeight);
        });
        allocation.allocateRemainsWeightToCash();

        const newAllocation = allocation.getAllocation();
        this.portfolio.executeAllocation(newAllocation);
      }
      this.afterMarket();

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run12(momentumWindow, top) {
    // 절대모멘텀 점수 : 최근 momentumWindow 거래일 수익률
    // 세계주가지수를 절대모멘텀으로 두고
    // 주가지수들의 상대모멘텀으로 자산 배분
    // 상승장일경우, 주식 60
    // 하락장일경우, 주식 20

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const stockCodeList = [
      "069500",
      "232080",
      "143850",
      "195930",
      "238720",
      "192090"
    ];

    const allocation = new PortfolioAllocation();
    while (true) {
      if (this.shouldTrade()) {
        allocation.reset();

        // 코스피10 미국10 하이일드10 골드5
        allocation.addWeight("069500", 10);
        allocation.addWeight("143850", 10);
        allocation.addWeight("182490", 5);
        allocation.addWeight("132030", 5);

        const marketState = Analyst.getMomentum1(
          "WORLD_STOCK",
          this.date,
          momentumWindow
        );

        if (marketState > 0) {
          // 상승장
          const scoreList = [];
          stockCodeList.forEach((code, index) => {
            const momentumScore = Analyst.getMomentum1(
              code,
              this.date,
              momentumWindow
            );
            scoreList.push(momentumScore);
          });

          const scoreObjList = [];
          stockCodeList.forEach((code, i) => {
            scoreObjList.push({ code, momentumScore: scoreList[i] });
          });

          // 모멘텀 점수 내림차순 정렬
          scoreObjList.sort((a, b) => {
            return b.momentumScore - a.momentumScore;
          });

          const topCodesList = scoreObjList.slice(0, top).map(d => d.code);

          topCodesList.forEach(code => {
            allocation.addWeight(code, 20);
          });

          // 남은 비중 중기회사채, 하이일드 배분
          const safetyAssets = ["136340", "182490"];
          const equalWeight =
            allocation.getRemainsWeight() / safetyAssets.length;
          safetyAssets.forEach(code => {
            allocation.addWeight(code, equalWeight);
          });
        } else {
          // 하락장
          // 남은 비중 채권, 인버스, 달러 배분

          const safetyAssets = [
            "148070", // KOSEF국고채10년
            "136340", // KBSTAR중기우량회사채
            "182490", // TIGER단기선진하이일드(합성H)
            "114800", // KODEX인버스
            "138230" // KOSEF미국달러선물
          ];
          const equalWeight =
            allocation.getRemainsWeight() / safetyAssets.length;
          safetyAssets.forEach(code => {
            allocation.addWeight(code, equalWeight);
          });
        }
        allocation.allocateRemainsWeightToCash();

        const newAllocation = allocation.getAllocation();
        this.portfolio.executeAllocation(newAllocation);
      }
      this.afterMarket();

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run13(momentumWindow, top, stockWeight, asset) {
    // 절대모멘텀 점수 : 최근 momentumWindow 거래일 수익률
    // 세계주가지수를 절대모멘텀으로 두고
    // 주가지수들의 상대모멘텀으로 자산 배분
    // 상승장일경우, 주식 100
    // 하락장일경우, 주식 0

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    stockWeight = Number(stockWeight);

    const stockCodeList = [
      "069500",
      "232080",
      "143850",
      "195930",
      "238720",
      "192090"
    ];

    const allocation = new PortfolioAllocation();
    while (true) {
      if (this.shouldTrade()) {
        allocation.reset();

        const marketState = Analyst.getMomentum1(
          "WORLD_STOCK",
          this.date,
          momentumWindow
        );

        if (marketState > 0) {
          // 상승장
          const scoreList = [];
          stockCodeList.forEach((code, index) => {
            const momentumScore = Analyst.getMomentum1(
              code,
              this.date,
              momentumWindow
            );
            scoreList.push(momentumScore);
          });

          const scoreObjList = [];
          stockCodeList.forEach((code, i) => {
            scoreObjList.push({ code, momentumScore: scoreList[i] });
          });

          // 모멘텀 점수 내림차순 정렬
          scoreObjList.sort((a, b) => {
            return b.momentumScore - a.momentumScore;
          });

          const topCodesList = scoreObjList.slice(0, top).map(d => d.code);
          const weightOfOneDiv = stockWeight / topCodesList.length;

          topCodesList.forEach(code => {
            allocation.addWeight(code, weightOfOneDiv);
          });
          // // 남은 비중 채권배분
          // const safetyAssets = [
          //   "148070", // KOSEF국고채10년
          //   "136340", // KBSTAR중기우량회사채
          //   "182490" // TIGER단기선진하이일드(합성H)
          // ];
          // const equalWeight =
          //   allocation.getRemainsWeight() / safetyAssets.length;
          // safetyAssets.forEach(code => {
          //   allocation.addWeight(code, equalWeight);
          // });
          allocation.addWeight(asset, allocation.getRemainsWeight());
        } else {
          //   하락장
          //   custom 비중으로 배분
          //   // 남은 비중 채권, 인버스, 달러 배분
          //   const safetyAssets = [
          //     "148070", // KOSEF국고채10년
          //     "136340", // KBSTAR중기우량회사채
          //     "182490", // TIGER단기선진하이일드(합성H)
          //     "114800", // KODEX인버스
          //     "138230" // KOSEF미국달러선물
          //   ];
          //   const equalWeight =
          //     allocation.getRemainsWeight() / safetyAssets.length;
          //   safetyAssets.forEach(code => {
          //     allocation.addWeight(code, equalWeight);
          //   });
          // this.fixedAlloc.forEach(asset => {
          //   allocation.addWeight(asset.code, asset.weight);
          // });
          allocation.addWeight(asset, allocation.getRemainsWeight());
        }
        allocation.allocateRemainsWeightToCash();
        const newAllocation = allocation.getAllocation();
        this.portfolio.executeAllocation(newAllocation);
      }
      this.afterMarket();

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run14(backtestArgs) {
    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const stockCodeList = [
      "069500",
      "232080",
      "143850",
      "195930",
      "238720",
      "192090"
    ];

    const allocation = new PortfolioAllocation();

    const context = {
      stockCodeList,
      allocation,
      simulationArgs: backtestArgs,
      backtest: this,
      portfolio: this.portfolio
    };

    while (true) {
      if (this.shouldTrade()) {
        intraMarket(context, Strategy.strategy14);
      }
      this.afterMarket();

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
	  
	  
	console.log("end date : ", context.backtest.date)
	console.log("next position : ", Strategy.positionOfStrategy14(context, context.backtest.date));
    this.orderLog = this.portfolio.log;
  }

  run15(momentumWindow, top) {
    // FAA 전략 모멘텀 + 변동성 + 상관성

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const assetCodeList = [
      "069500", // KODEX200
      "232080", // TIGER코스닥150
      "143850", // TIGER미국S&P500선물(H)
      "195930", // TIGER유로스탁스50(합성H)
      "238720", // KINDEX일본Nikkei225(H)
      "192090", // TIGER차이나CSI300
      "148070", // KOSEF국고채10년
      "136340", // KBSTAR중기우량회사채
      "182490" // TIGER단기선진하이일드(합성
      // "132030", // KODEX골드선물(H)
      // "130680", // TIGER원유선물Enhanced(H)
      // "138230" // KOSEF미국달러선물
      // "130730", // KOSEF단기자금
      // "114800", // KODEX인버스
      // "139660" // KOSEF미국달러선물인버스
    ];

    const allocation = new PortfolioAllocation();
    while (true) {
      if (this.shouldTrade()) {
        allocation.reset();

        const momentumScores = assetCodeList.map(code =>
          Analyst.getMomentum1(code, this.date, momentumWindow)
        );
        const volatilityScore = assetCodeList.map(code =>
          Analyst.getStd(code, this.date, momentumWindow)
        );
        const corScoreList = Analyst.getCorScore(
          assetCodeList,
          this.date,
          momentumWindow
        );

        const momentumRank = toRank(momentumScores, true); // 내림차순
        const volatilityRank = toRank(volatilityScore, false); // 오름차순
        const corScoreRank = toRank(corScoreList, false); // 오름차순

        const totalScore = [];
        for (let i = 0; i < assetCodeList.length; i++) {
          const tempScore =
            momentumRank[i] + volatilityRank[i] * 2 + corScoreRank[i] * 2;
          totalScore.push(tempScore);
        }
        const totalScoreRank = toRank(corScoreRank, false);

        const scoreObjList = assetCodeList.map((code, i) => {
          return { code, rank: totalScoreRank[i] };
        });
        scoreObjList.sort((a, b) => {
          return a.rank - b.rank; // 모멘텀 점수 오름차순 정렬
        });
        const topCodesList = scoreObjList.slice(0, top).map(d => d.code);

        const div = 25;
        // 최근 수익률이 0 이상이면 매수
        topCodesList.forEach(code => {
          const momentum = Analyst.getMomentum1(
            code,
            this.date,
            momentumWindow
          );
          if (momentum > 0) {
            allocation.addWeight(code, div);
          }
        });

        allocation.allocateRemainsWeightToCash();
        const newAllocation = allocation.getAllocation();

        this.portfolio.executeAllocation(newAllocation);
      }
      this.afterMarket();

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  createMetaData() {
    this.returnList = this.navList.map((price, index) => {
      if (index === 0) {
        return NaN;
      }

      const prevPrice = this.navList[index - 1];
      const pctChange = ((price - prevPrice) / prevPrice) * 100;
      return pctChange;
    });

    this.cumReturnList = this.navList.map((price, index) => {
      if (index === 0) {
        return 0;
      }

      const prevPrice = this.navList[0];
      const pctChange = ((price - prevPrice) / prevPrice) * 100;
      return pctChange;
    });
  }
}

class BackTestArgsHandler {
  constructor() {
    this.argsObject = {
      startDate: "20170216",
      endDate: "20181207",
      rebalanceDateList: [],
      allocation: [
        { code: "069500", weight: 30 },
        { code: "232080", weight: 0 },

        { code: "143850", weight: 20 },
        { code: "195930", weight: 0 },
        { code: "238720", weight: 0 },
        { code: "192090", weight: 0 },

        { code: "148070", weight: 20 },
        { code: "136340", weight: 15 },
        { code: "182490", weight: 5 },

        { code: "132030", weight: 5 },
        { code: "130680", weight: 0 },

        { code: "114800", weight: 0 },

        { code: "138230", weight: 0 },
        { code: "139660", weight: 0 },

        { code: "130730", weight: 4 },
        { code: "WORLD_STOCK", weight: 0 },
        { code: "cash", weight: 1 }
      ]
    };
  }

  setDateRange(startDate, endDate) {
    this.argsObject.startDate = startDate;
    this.argsObject.endDate = endDate;
  }

  setRebalanceDateList(dateList) {
    this.argsObject.rebalanceDateList = dateList;
  }

  getArgs() {
    return this.argsObject;
  }

  replaceAllocation(newAllocation) {
    this.argsObject.allocation = this.argsObject.allocation.map(
      (data, index) => {
        return {
          code: data.code,
          weight: newAllocation[index]
        };
      }
    );
  }
}

const DEFAULT_ALLOCATION = {
  "069500": 0, // KODEX200
  "232080": 0, // TIGER코스닥150
  "143850": 0, // TIGER미국S&P500선물(H)
  "195930": 0, // TIGER유로스탁스50(합성H)
  "238720": 0, // KINDEX일본Nikkei225(H)
  "192090": 0, // TIGER차이나CSI300
  "148070": 0, // KOSEF국고채10년
  "136340": 0, // KBSTAR중기우량회사채
  "182490": 0, // TIGER단기선진하이일드(합성
  "132030": 0, // KODEX골드선물(H)
  "130680": 0, // TIGER원유선물Enhanced(H)
  "114800": 0, // KODEX인버스
  "138230": 0, // KOSEF미국달러선물
  "139660": 0, // KOSEF미국달러선물인버스
  "130730": 0, // KOSEF단기자금
  WORLD_STOCK: 0, // 세계종합주가지수
  cash: 0 // 현금
};

class PortfolioAllocation {
  constructor() {
    this.allocation = { ...DEFAULT_ALLOCATION };
  }

  addWeight = (code, weight) => {
    if (this.remainWeight < weight) {
      throw "not enough remainWeight ";
    }
    this.allocation[code] += weight;
  };

  getWeight = code => {
    return this.allocation[code];
  };

  reset = () => {
    this.allocation = { ...DEFAULT_ALLOCATION };
  };

  getRemainsWeight = () => {
    const keys = Object.keys(this.allocation);
    let totalWeight = 0;
    keys.forEach(key => {
      totalWeight += this.allocation[key];
    });
    return 100 - totalWeight;
  };

  allocateRemainsWeightToCash = () => {
    const remainsWeight = this.getRemainsWeight();
    this.addWeight("cash", remainsWeight);
  };

  getAllocation = () => {
    if (this.getRemainsWeight() !== 0) {
      console.log(this.getRemainsWeight());
      throw "remainsWeight !== 0";
    }

    const keys = Object.keys(this.allocation);
    return keys.map(key => {
      return {
        code: key,
        weight: this.allocation[key]
      };
    });
  };
}

const summaryTable = (codeList, startDate, endDate) => {
  const market = new Market(startDate);
  const results = [];
  codeList.forEach(code => {
    let result = {};

    result.code = code;

    market.setDate(startDate);
    const basePrice = market.getPrice(code);
    market.setDate(endDate);
    const finalPrice = market.getPrice(code);
    const HPR = (finalPrice - basePrice) / basePrice;
    result.returns = HPR;

    const returnsList = market
      .getReturnsListInRange(code, startDate, endDate)
      .map(returns => returns / 100);
    returnsList.shift();

    const period = returnsList.length;
    result.annualizedReturns = getAnnualizedReturns(HPR, period);

    const std = math.std(returnsList);
    result.std = std;
    result.annualizedStd = getAnnualizedStd(std);

    results.push(result);
  });
  return results;
};

const a = { one: 1, two: 2 };
console.log(a);

const test = arg => {
  arg.one = 2;
};
test(a);
console.log(a);

export { BackTest, BackTestArgsHandler, summaryTable };
