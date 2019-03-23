import * as mathjs from "mathjs";

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

export { getRandomAllocation, getRandAllocWithFixedWeights, getStdMovingAvg };
