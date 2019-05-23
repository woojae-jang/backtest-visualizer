import { Market } from "../market";
import * as math from "mathjs";
import { tradingDateList, assetCodeList } from "./data";
import { getAnnualizedReturns, getAnnualizedStd } from "utils/utils";
import { Analyst } from "utils/analyst";

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

class BackTest {
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
    this.portfolio.executeAllocation(this.fixedAlloc);
    while (true) {
      const rebalanceDay = this.rebalanceDateList.indexOf(this.date);
      if (rebalanceDay !== -1) {
        this.portfolio.executeAllocation(this.fixedAlloc);
      }
      const NAV = this.portfolio.valuation();
      const shortLog = "date: " + this.date + " NAV: " + NAV;
      const allcation = this.portfolio.getCurrentAllocation();

      this.dailyLog.push(shortLog);
      this.navList.push(NAV);
      this.allocationList.push(allcation);
      this.dateList.push(this.date);

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run2(momentumWindow = 60) {
    // 모멘텀 점수 : 최근 momentumWindow 거래일 수익률
    // 리밸런싱 날, 모멘텀 점수가 가장 높은 자산의 비중을 100

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const codeList = assetCodeList;
    while (true) {
      const rebalanceDay = this.rebalanceDateList.indexOf(this.date);
      if (rebalanceDay !== -1) {
        const scoreList = [];
        codeList.forEach((code, index) => {
          const momentumScore = Analyst.getMomentum1(
            code,
            this.date,
            momentumWindow
          );
          scoreList.push(momentumScore);
        });

        let maxScoreIdx = scoreList.indexOf(Math.max(...scoreList));
        const codeOfMaxScore = codeList[maxScoreIdx];

        const newAllocation = [...codeList, "cash"].map(code => {
          if (code === codeOfMaxScore) {
            return {
              code,
              weight: 100
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
      const NAV = this.portfolio.valuation();
      const shortLog = "date: " + this.date + " NAV: " + NAV;
      const allcation = this.portfolio.getCurrentAllocation();

      this.dailyLog.push(shortLog);
      this.navList.push(NAV);
      this.allocationList.push(allcation);
      this.dateList.push(this.date);

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run3(top = 1, momentumWindow = 60) {
    // top <= 6
    // 모멘텀 점수 : 최근 momentumWindow 거래일 수익률
    // 리밸런싱 날, 주식지수 6개중 모멘텀 점수가 높은 top개 지수를 100/top 씩 (동일비중)

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const codeList = assetCodeList;
    const stockCodeList = codeList.slice(0, 6);
    while (true) {
      const rebalanceDay = this.rebalanceDateList.indexOf(this.date);
      if (rebalanceDay !== -1) {
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
      const NAV = this.portfolio.valuation();
      const shortLog = "date: " + this.date + " NAV: " + NAV;
      const allcation = this.portfolio.getCurrentAllocation();

      this.dailyLog.push(shortLog);
      this.navList.push(NAV);
      this.allocationList.push(allcation);
      this.dateList.push(this.date);

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run4(momentumWindow = 60) {
    // 모멘텀 점수 : 최근 momentumWindow 거래일 수익률
    // 리밸런싱 날, 우선적으로 절대모멘텀 점수로 필터링
    // 필터링된 주가지수 n개
    // n 의 크기에 따라 주식:채권 비중 결정 (채권은 하이일드)

    // 절대모멘텀 필터 점수
    const absScore = 0;

    // 채권
    const bondCode = "182490";

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const codeList = assetCodeList;
    const stockCodeList = codeList.slice(0, 6);
    while (true) {
      const rebalanceDay = this.rebalanceDateList.indexOf(this.date);
      if (rebalanceDay !== -1) {
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
        const weightOfBond = 100 - weightOfStock;

        const newAllocation = [...codeList, "cash"].map(code => {
          if (filterdCodeList.indexOf(code) !== -1) {
            return {
              code,
              weight: weightOfOneDiv
            };
          } else if (code === bondCode) {
            return {
              code,
              weight: weightOfBond
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
      const NAV = this.portfolio.valuation();
      const shortLog = "date: " + this.date + " NAV: " + NAV;
      const allcation = this.portfolio.getCurrentAllocation();

      this.dailyLog.push(shortLog);
      this.navList.push(NAV);
      this.allocationList.push(allcation);
      this.dateList.push(this.date);

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run5(momentumWindow = 60) {
    // 모멘텀 점수 : 최근 momentumWindow 거래일 수익률
    // 리밸런싱 날, 주식지수 6개의 모멘텀 점수 랭크를 메긴 다음, 순위별로 차등 비중

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const codeList = assetCodeList;
    const stockCodeList = codeList.slice(0, 6);
    while (true) {
      const rebalanceDay = this.rebalanceDateList.indexOf(this.date);
      if (rebalanceDay !== -1) {
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

        const orderdCodeList = scoreObjList.map(obj => obj.code);
        const rankWeightList = [30, 25, 20, 15, 10, 0];

        const newAllocation = [...codeList, "cash"].map(code => {
          const stockCodeIdx = orderdCodeList.indexOf(code);
          if (stockCodeIdx !== -1) {
            return {
              code,
              weight: rankWeightList[stockCodeIdx]
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
      const NAV = this.portfolio.valuation();
      const shortLog = "date: " + this.date + " NAV: " + NAV;
      const allcation = this.portfolio.getCurrentAllocation();

      this.dailyLog.push(shortLog);
      this.navList.push(NAV);
      this.allocationList.push(allcation);
      this.dateList.push(this.date);

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run6(top = 2) {
    // 모멘텀 점수 : 1,3,6개월 평균수익률
    // 리밸런싱 날, 주식지수 6개중 모멘텀 점수가 높은 top개 지수를 100/top 씩 (동일비중)

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const codeList = assetCodeList;
    const stockCodeList = codeList.slice(0, 6);
    while (true) {
      const rebalanceDay = this.rebalanceDateList.indexOf(this.date);
      if (rebalanceDay !== -1) {
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
      const NAV = this.portfolio.valuation();
      const shortLog = "date: " + this.date + " NAV: " + NAV;
      const allcation = this.portfolio.getCurrentAllocation();

      this.dailyLog.push(shortLog);
      this.navList.push(NAV);
      this.allocationList.push(allcation);
      this.dateList.push(this.date);

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

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
    while (true) {
      const rebalanceDay = this.rebalanceDateList.indexOf(this.date);
      if (rebalanceDay !== -1) {
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

        const newAllocation = [...codeList, "cash"].map(code => {
          if (filterdCodeList.indexOf(code) !== -1) {
            return {
              code,
              weight: weightOfOneDiv
            };
          } else if (code === bondCode) {
            return {
              code,
              weight: weightOfBond
            };
          } else if (code === dollarCode) {
            return {
              code,
              weight: weightOfDollar
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
      const NAV = this.portfolio.valuation();
      const shortLog = "date: " + this.date + " NAV: " + NAV;
      const allcation = this.portfolio.getCurrentAllocation();

      this.dailyLog.push(shortLog);
      this.navList.push(NAV);
      this.allocationList.push(allcation);
      this.dateList.push(this.date);

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run8(top = 1, momentumWindow = 60) {
    // top <= 15
    // 모멘텀 점수 : 최근 momentumWindow 거래일 수익률
    // 리밸런싱 날, 모멘텀 점수가 높은 top개 지수를 100/top 씩 (동일비중)

    // 첫 거래일, 초기 비중 설정을 위해
    this.rebalanceDateList.push(this.date);

    const codeList = assetCodeList;
    while (true) {
      const rebalanceDay = this.rebalanceDateList.indexOf(this.date);
      if (rebalanceDay !== -1) {
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
      const NAV = this.portfolio.valuation();
      const shortLog = "date: " + this.date + " NAV: " + NAV;
      const allcation = this.portfolio.getCurrentAllocation();

      this.dailyLog.push(shortLog);
      this.navList.push(NAV);
      this.allocationList.push(allcation);
      this.dateList.push(this.date);

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
      const rebalanceDay = this.rebalanceDateList.indexOf(this.date);
      if (rebalanceDay !== -1) {
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
      const NAV = this.portfolio.valuation();
      const shortLog = "date: " + this.date + " NAV: " + NAV;
      const allcation = this.portfolio.getCurrentAllocation();

      this.dailyLog.push(shortLog);
      this.navList.push(NAV);
      this.allocationList.push(allcation);
      this.dateList.push(this.date);

      if (this.date === this.endDate) break;
      this.forwardDate();
    }
    this.orderLog = this.portfolio.log;
  }

  run10(momentumWindow, top) {
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

    while (true) {
      const rebalanceDay = this.rebalanceDateList.indexOf(this.date);
      if (rebalanceDay !== -1) {
        let newAllocation = [
          { code: "069500", weight: 10 }, // KODEX200
          { code: "232080", weight: 0 }, // TIGER코스닥150
          { code: "143850", weight: 10 }, // TIGER미국S&P500선물(H)
          { code: "195930", weight: 0 }, // TIGER유로스탁스50(합성H)
          { code: "238720", weight: 0 }, // KINDEX일본Nikkei225(H)
          { code: "192090", weight: 0 }, // TIGER차이나CSI300
          { code: "148070", weight: 0 }, // KOSEF국고채10년
          { code: "136340", weight: 0 }, // KBSTAR중기우량회사채
          { code: "182490", weight: 5 }, // TIGER단기선진하이일드(합성H)
          { code: "132030", weight: 5 }, // KODEX골드선물(H)
          { code: "130680", weight: 0 }, // TIGER원유선물Enhanced(H)
          { code: "114800", weight: 0 }, // KODEX인버스
          { code: "138230", weight: 0 }, // KOSEF미국달러선물
          { code: "139660", weight: 0 }, // KOSEF미국달러선물인버스
          { code: "130730", weight: 0 }, // KOSEF단기자금
          { code: "WORLD_STOCK", weight: 0 }, // 세계종합주가지수
          { code: "cash", weight: 1 } // 현금
        ];

        let remainWeight = 100 - 26;

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

          newAllocation = newAllocation.map(asset => {
            if (topCodesList.indexOf(asset.code) !== -1) {
              asset.weight += 20;
              remainWeight -= 20;
              return asset;
            } else {
              return asset;
            }
          });

          // 남은 비중 중기회사채, 하이일드 배분
          const safetyAssets = ["136340", "182490"];
          const eqaulWeight = remainWeight / safetyAssets.length;

          newAllocation = newAllocation.map(asset => {
            if (safetyAssets.indexOf(asset.code) !== -1) {
              asset.weight = eqaulWeight;
              return asset;
            } else {
              return asset;
            }
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
          const eqaulWeight = remainWeight / safetyAssets.length;

          newAllocation = newAllocation.map(asset => {
            if (safetyAssets.indexOf(asset.code) !== -1) {
              asset.weight = eqaulWeight;
              return asset;
            } else {
              return asset;
            }
          });
        }

        let accWeight = 0;
        newAllocation.forEach(asset => (accWeight += asset.weight));
        newAllocation = newAllocation.map(asset => {
          if (asset.code === "cash") {
            asset.weight += 100 - accWeight;
            return asset;
          } else {
            return asset;
          }
        });

        this.portfolio.executeAllocation(newAllocation);
      }
      const NAV = this.portfolio.valuation();
      const shortLog = "date: " + this.date + " NAV: " + NAV;
      const allcation = this.portfolio.getCurrentAllocation();

      this.dailyLog.push(shortLog);
      this.navList.push(NAV);
      this.allocationList.push(allcation);
      this.dateList.push(this.date);

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

    const codeList = assetCodeList;
    while (true) {
      const rebalanceDay = this.rebalanceDateList.indexOf(this.date);
      if (rebalanceDay !== -1) {
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
        const remainWeight = 100 - filterdCodeList.length * equalWeight;

        const newAllocation = [...codeList, "cash"].map(code => {
          if (filterdCodeList.indexOf(code) !== -1) {
            return {
              code,
              weight: equalWeight
            };
          } else if (code === "cash") {
            return {
              code,
              weight: remainWeight
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
      const NAV = this.portfolio.valuation();
      const shortLog = "date: " + this.date + " NAV: " + NAV;
      const allcation = this.portfolio.getCurrentAllocation();

      this.dailyLog.push(shortLog);
      this.navList.push(NAV);
      this.allocationList.push(allcation);
      this.dateList.push(this.date);

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

export { BackTest, BackTestArgsHandler, summaryTable };
