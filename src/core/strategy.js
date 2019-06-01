import { Analyst } from "utils/analyst";

const strategy2 = context => {
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

export { strategy2, strategy3 };
