import * as mathjs from "mathjs";
import * as jStat from "jStat";

const getRandomAllocation = division => {
  let weight_list = [];
  for (let i = 0; i < division; i++) {
    weight_list.push(Math.random());
  }
  const total_weight = mathjs.sum(weight_list);
  weight_list = weight_list.map(weight => {
    return (weight / total_weight) * 100;
  });
  return weight_list;
};

const getIntRandWeights = division => {
  let randomWeights = getRandomAllocation(division);
  randomWeights = randomWeights.map(value => mathjs.floor(value));
  const remainWieght = 100 - mathjs.sum(randomWeights);
  randomWeights[randomWeights.length - 1] += remainWieght;
  return randomWeights;
};

const getFloatRandWeights = (division, digits = 2) => {
  let randomWeights = getRandomAllocation(division);

  randomWeights = randomWeights.map(value => value * 10 ** digits);

  randomWeights = randomWeights.map(value => mathjs.floor(value));
  const remainWieght = 100 * 10 ** digits - mathjs.sum(randomWeights);
  randomWeights[randomWeights.length - 1] += remainWieght;

  randomWeights = randomWeights.map(value => value / 10 ** digits);

  return randomWeights;
};

const getRandAllocWithFixedWeights = weightsWithfixedWeight => {
  const numOfFreeAssets = weightsWithfixedWeight.filter(d => d === null).length;
  const weightsOfFree =
    100 - mathjs.sum(weightsWithfixedWeight.filter(d => d !== null));

  let weightsOfFreeAssets = getRandomAllocation(numOfFreeAssets);

  const sumOfWeights = mathjs.sum(weightsOfFreeAssets);
  weightsOfFreeAssets = mathjs.multiply(
    weightsOfFreeAssets,
    weightsOfFree / sumOfWeights
  );

  const output = weightsWithfixedWeight.map(d => {
    if (d !== null) return d;
    return weightsOfFreeAssets.shift();
  });
  return output;
};

const getCumPctChange = navList => {
  const cumPctChangeList = [];

  const basePrice = navList[0];
  navList.map(price => {
    const pctChange = ((price - basePrice) / basePrice) * 100;
    cumPctChangeList.push(pctChange);
    return null;
  });

  return cumPctChangeList;
};

const mStd = (arr, stIdx, enIdx) => {
  return std(arr.slice(stIdx, enIdx));
};

const std = arr => {
  return mathjs.std(arr);
};

// function avg(arr, idx, range) {
//   return sum(arr.slice(idx - range, idx)) / range;
// }

const getStdMovingAvg = (pctChange, window) => {
  const length = pctChange.length;
  const data = [];
  let value = null;
  for (let i = 0; i < length - window + 1; i++) {
    value = mStd(pctChange, i, i + window);
    data.push(value);
  }
  return data;

  // let data = sma(pctChange, ma, d => d);
};

const getMovingCor = (onePctChange, anotherPctChange, window) => {
  if (onePctChange.length !== anotherPctChange.length) {
    // eslint-disable-next-line no-throw-literal
    throw "length error";
  }

  const length = onePctChange.length;
  const data = [];
  let corrcoeff = null;
  for (let i = 0; i < length - window + 1; i++) {
    corrcoeff = jStat.corrcoeff(
      onePctChange.slice(i, i + window),
      anotherPctChange.slice(i, i + window)
    );
    data.push(corrcoeff);
  }
  return data;
};

const createLinearReturns = (finalReturn, length) => {
  const step = Math.pow(finalReturn, 1 / length);
  const array = new Array(length).fill(step);
  return array;
};

const addOneDay = date => {
  const tomorrow = new Date();
  tomorrow.setTime(date.getTime() + 86400000); // 86400000 하루 ms
  return tomorrow;
};

const getAnnualizedReturns = (returns, days) => {
  const numOfTradingDaysOfOneYear = 252;
  const annualized = days / numOfTradingDaysOfOneYear;
  return (1 + returns) ** (1 / annualized) - 1;
};

const getAnnualizedStd = std => {
  const N = 252;
  return std * N ** (1 / 2);
};

const toRank = (array, des = true) => {
  const sorted = array.slice().sort((a, b) => {
    if (des) {
      return b - a;
    } else {
      return a - b;
    }
  });
  const ranks = array.slice().map(v => {
    return sorted.indexOf(v) + 1;
  });
  return ranks;
};

// const getMaximumDrawDown = valueList => {
//   let lastPeak = {
//     value: 0
//   };
//   let lastDrawDown = {
//     startIndex: null,
//     endIndex: null
//   };
//   valueList.forEach((value, index) => {
//     if (value > lastPeak.value) {
//       // end last drawdown
//     } else {
//       // start new drawdown
//     }
//   });
// };

const getMaximumDrawDown = valueList => {
  const maxList = [0];

  valueList.forEach((value, index) => {
    if (index === 0) {
      return null;
    } else {
      maxList.push(Math.max(maxList[index - 1], value));
    }
  });

  const maxDrowDown = Math.min(...mathjs.dotDivide(valueList, maxList));
  return 1 - maxDrowDown;
};

export {
  getRandomAllocation,
  getRandAllocWithFixedWeights,
  getStdMovingAvg,
  getCumPctChange,
  getMovingCor,
  addOneDay,
  getIntRandWeights,
  getFloatRandWeights,
  getAnnualizedReturns,
  getAnnualizedStd,
  toRank,
  getMaximumDrawDown
};
