import { Analyst } from "utils/analyst";

const strategy2 = context => {
  // gaps 의 '모든 자산'에 대한 상대모멘텀
  // 리밸런싱 날, 모멘텀 점수가 가장 높은 자산의 비중을 100
  // 모멘텀 점수 : 최근 momentumWindow 거래일 수익률
  const { allocation, backtest, portfolio, codeList, simulationArgs } = context;
  const { momentumWindow } = simulationArgs;
  allocation.reset();
  const scoreList = [];
  codeList.forEach((code, index) => {
    const momentumScore = Analyst.getMomentum1(
      code,
      backtest.date,
      momentumWindow
    );
    scoreList.push(momentumScore);
  });

  let maxScoreIdx = scoreList.indexOf(Math.max(...scoreList));
  const codeOfMaxScore = codeList[maxScoreIdx];

  allocation.addWeight(codeOfMaxScore, 100);
  const newAllocation = allocation.getAllocation();

  portfolio.executeAllocation(newAllocation);
};

const strategy3 = context => {
  // top <= 6
  // 모멘텀 점수 : 최근 momentumWindow 거래일 수익률
  // 리밸런싱 날, '주식'지수 6개중 모멘텀 점수가 높은 top개 지수를 100/top 씩 (동일비중)
  const {
    allocation,
    backtest,
    portfolio,
    stockCodeList,
    simulationArgs
  } = context;
  const { momentumWindow, top } = simulationArgs;
  allocation.reset();
  const scoreList = [];

  stockCodeList.forEach((code, index) => {
    const momentumScore = Analyst.getMomentum1(
      code,
      backtest.date,
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
  const equalWeight = 100 / top;

  topCodesList.forEach(code => allocation.addWeight(code, equalWeight));

  const newAllocation = allocation.getAllocation();
  portfolio.executeAllocation(newAllocation);
};

const strategy4 = context => {
  // 모멘텀 점수 : 최근 momentumWindow 거래일 수익률
  // 리밸런싱 날, 우선적으로 절대모멘텀 점수로 필터링
  // 필터링된 주가지수 n개
  // n 의 크기에 따라 주식:채권 비중 결정
  // 채권: selectedAsset
  const {
    allocation,
    backtest,
    portfolio,
    stockCodeList,
    simulationArgs
  } = context;
  const { momentumWindow, selectedAsset } = simulationArgs;

  // 절대모멘텀 필터 점수
  const absScore = 0;
  // 채권
  const bondCode = selectedAsset;
  allocation.reset();
  const scoreList = [];

  stockCodeList.forEach((code, index) => {
    const momentumScore = Analyst.getMomentum1(
      code,
      backtest.date,
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

  filterdCodeList.forEach(code => allocation.addWeight(code, weightOfOneDiv));
  allocation.addWeight(bondCode, weightOfBond);

  const newAllocation = allocation.getAllocation();
  portfolio.executeAllocation(newAllocation);
};

export { strategy2, strategy3, strategy4 };
