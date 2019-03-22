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

export { getRandomAllocation, getRandAllocWithFixedWeights };
