import * as mathjs from "mathjs";

const getRandomAllocation = division => {
  const alloc = [];
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

export { getRandomAllocation };
