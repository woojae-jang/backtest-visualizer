import { schemeCategory10 } from "d3-scale-chromatic";

const dynamicColors = () => {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
};

const linspace = (a, b, n) => {
  if (typeof n === "undefined") n = Math.max(Math.round(b - a) + 1, 1);
  if (n < 2) {
    return n === 1 ? [a] : [];
  }
  var i,
    ret = Array(n);
  n--;
  for (i = n; i >= 0; i--) {
    ret[i] = (i * b + (n - i) * a) / n;
  }
  return ret;
};

const getLineDataFromEquation = (gradient, yIntercept) => {
  const x = linspace(-2, 2, 100);
  const y = x.map(d => d * gradient + yIntercept);

  return x.map((data, index) => {
    return { x: data, y: y[index] };
  });
};

const generateSchemeCategory20 = () => {
  const arr = [...schemeCategory10];
  for (let i = 0; i < 10; i++) {
    arr.push(dynamicColors());
  }
  return arr;
};

const schemeCategory20 = generateSchemeCategory20();

export { dynamicColors, getLineDataFromEquation, schemeCategory20 };
