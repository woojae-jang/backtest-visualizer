import { Analyst } from "utils/analyst";
import { assetCodeList, assetNameList} from "utils/data"

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
  const { selectedAsset } = simulationArgs;
  const momentumWindow = simulationArgs.strategyArg1;

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

const strategy5 = context => {
  // 모멘텀 점수 : 최근 momentumWindow 거래일 수익률
  // 리밸런싱 날, 주식지수 6개의 모멘텀 점수 랭크를 메긴 다음, 순위별로 차등 비중
  const {
    allocation,
    backtest,
    portfolio,
    stockCodeList,
    simulationArgs
  } = context;

  const momentumWindow = simulationArgs.strategyArg1;

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

  const orderdCodeList = scoreObjList.map(obj => obj.code);
  const rankWeightList = [30, 25, 20, 15, 10, 0];
  orderdCodeList.forEach((code, index) =>
    allocation.addWeight(code, rankWeightList[index])
  );

  const newAllocation = allocation.getAllocation();

  portfolio.executeAllocation(newAllocation);
};

const strategy14 = context => {
  // run10 과 유사하나 인버스 편입 안하였음
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
  const {
    allocation,
    backtest,
    portfolio,
    simulationArgs,
    stockCodeList
  } = context;

  const momentumWindow = simulationArgs.strategyArg1;
  const top = simulationArgs.strategyArg2;

  allocation.reset();

  const marketState = Analyst.getMomentum1(
    "WORLD_STOCK",
    backtest.date,
    momentumWindow
  );

  if (marketState > 0) {
    // 상승장
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

    if (top == 1) {
      const code = topCodesList[0];
      if (code === "069500") {
        // 코스피
        // 코스피20 미국10
        allocation.addWeight("069500", 20);
        allocation.addWeight("143850", 10);
      } else if (code === "232080") {
        // 코스닥
        // 코스닥10 미국10
        allocation.addWeight("232080", 20);
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
        allocation.addWeight("232080", 20);
        allocation.addWeight("143850", 10);
      } else if (condition1 || condition2) {
        if (condition1) {
          // 코스피20 해외20
          allocation.addWeight("069500", 20);
          if (code1 === "069500") {
            allocation.addWeight(code2, 20);
          } else {
            allocation.addWeight(code1, 20);
          }
        } else {
          // 코스닥20 해외20
          allocation.addWeight("232080", 20);
          if (code1 === "232080") {
            allocation.addWeight(code2, 20);
          } else {
            allocation.addWeight(code1, 20);
          }
        }
      } else {
        // 해외1 20 해외2 20 코스피10
        allocation.addWeight(code1, 20);
        allocation.addWeight(code2, 20);
        allocation.addWeight("069500", 10);
      }
    } else {
      console.log(top);
      throw "invalid top arg";
    }
    allocation.addWeight("132030", 5); // 골드 최소비중

    // 남은 비중 국채, 중기회사채, 하이일드 배분
    const safetyAssets = ["148070", "136340", "182490"];
    let equalWeight = null;
    let bondsWeights = [];

    if (allocation.getRemainsWeight() > 60) {
      // bondsWeights = [28, 27, 5];
      bondsWeights = [20, 20, 20];
    } else {
      // equalWeight = (allocation.getRemainsWeight() - 5) / 3;
      equalWeight = allocation.getRemainsWeight() / 3;
      // bondsWeights = [equalWeight * 2, equalWeight, 5];
      bondsWeights = [equalWeight, equalWeight, equalWeight];
    }

    safetyAssets.forEach((code, index) => {
      allocation.addWeight(code, bondsWeights[index]);
    });
  } else {
    // 하락장

    // 코스피10 미국10
    allocation.addWeight("069500", 10);
    allocation.addWeight("143850", 10);

    // 남은 비중 채권, 인버스, 달러 배분

    // KOSEF국고채10년
    // KBSTAR중기우량회사채
    // TIGER단기선진하이일드(합성H)
    // 다른 채권과 달리 하이일드는 주식과 양의 상관관계를 가졌기 때문에 낮은 비중 주었음
    const bonds = ["148070", "136340", "182490"];
    const bondsWeights = [36, 19, 5];
    allocation.addWeight("132030", 5); // 골드 최소비중

    bonds.forEach((code, index) => {
      allocation.addWeight(code, bondsWeights[index]);
    });

    const safetyAssets = [
      "114800", // KODEX인버스
      "138230" // KOSEF미국달러선물
    ];

    const equalWeight = allocation.getRemainsWeight() / safetyAssets.length;

    safetyAssets.forEach(code => {
      allocation.addWeight(code, equalWeight);
    });
  }

  allocation.allocateRemainsWeightToCash();
  const newAllocation = allocation.getAllocation();

  portfolio.executeAllocation(newAllocation);
};

const positionOfStrategy14 = (context, date) => {
  const {
    allocation,
    simulationArgs,
    stockCodeList
  } = context;

  const momentumWindow = simulationArgs.strategyArg1;
  const top = simulationArgs.strategyArg2;

  allocation.reset();

  const marketState = Analyst.getMomentum1(
    "WORLD_STOCK",
    date,
    momentumWindow,
	  false
  );

  if (marketState > 0) {
    // 상승장
    const scoreList = [];
    stockCodeList.forEach((code, index) => {
      const momentumScore = Analyst.getMomentum1(
        code,
        date,
        momentumWindow,
		  false
	  
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
        // 코스피20 미국10
        allocation.addWeight("069500", 20);
        allocation.addWeight("143850", 10);
      } else if (code === "232080") {
        // 코스닥
        // 코스닥10 미국10
        allocation.addWeight("232080", 20);
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
        allocation.addWeight("232080", 20);
        allocation.addWeight("143850", 10);
      } else if (condition1 || condition2) {
        if (condition1) {
          // 코스피20 해외20
          allocation.addWeight("069500", 20);
          if (code1 === "069500") {
            allocation.addWeight(code2, 20);
          } else {
            allocation.addWeight(code1, 20);
          }
        } else {
          // 코스닥20 해외20
          allocation.addWeight("232080", 20);
          if (code1 === "232080") {
            allocation.addWeight(code2, 20);
          } else {
            allocation.addWeight(code1, 20);
          }
        }
      } else {
        // 해외1 20 해외2 20 코스피10
        allocation.addWeight(code1, 20);
        allocation.addWeight(code2, 20);
        allocation.addWeight("069500", 10);
      }
    } else {
      console.log(top);
      throw "invalid top arg";
    }
    allocation.addWeight("132030", 5); // 골드 최소비중

    // 남은 비중 국채, 중기회사채, 하이일드 배분
    const safetyAssets = ["148070", "136340", "182490"];
    let equalWeight = null;
    let bondsWeights = [];

    if (allocation.getRemainsWeight() > 60) {
      // bondsWeights = [28, 27, 5];
      bondsWeights = [20, 20, 20];
    } else {
      // equalWeight = (allocation.getRemainsWeight() - 5) / 3;
      equalWeight = allocation.getRemainsWeight() / 3;
      // bondsWeights = [equalWeight * 2, equalWeight, 5];
      bondsWeights = [equalWeight, equalWeight, equalWeight];
    }

    safetyAssets.forEach((code, index) => {
      allocation.addWeight(code, bondsWeights[index]);
    });
  } else {
    // 하락장

    // 코스피10 미국10
    allocation.addWeight("069500", 10);
    allocation.addWeight("143850", 10);

    // 남은 비중 채권, 인버스, 달러 배분

    // KOSEF국고채10년
    // KBSTAR중기우량회사채
    // TIGER단기선진하이일드(합성H)
    // 다른 채권과 달리 하이일드는 주식과 양의 상관관계를 가졌기 때문에 낮은 비중 주었음
    const bonds = ["148070", "136340", "182490"];
    const bondsWeights = [36, 19, 5];
    allocation.addWeight("132030", 5); // 골드 최소비중

    bonds.forEach((code, index) => {
      allocation.addWeight(code, bondsWeights[index]);
    });

    const safetyAssets = [
      "114800", // KODEX인버스
      "138230" // KOSEF미국달러선물
    ];

    const equalWeight = allocation.getRemainsWeight() / safetyAssets.length;

    safetyAssets.forEach(code => {
      allocation.addWeight(code, equalWeight);
    });
  }

  allocation.allocateRemainsWeightToCash();
  const newAllocation = allocation.getAllocation();
  
	const result = newAllocation.map(asset => {
		const assetIdx = assetCodeList.indexOf(asset.code);
		return {...asset, name: assetNameList[assetIdx]}
	})
	
	
	return result;
};

export { strategy2, strategy3, strategy4, strategy5, strategy14, positionOfStrategy14 };
