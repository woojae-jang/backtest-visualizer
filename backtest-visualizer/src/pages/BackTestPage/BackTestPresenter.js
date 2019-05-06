import React from "react";
import PriceChart from "./PriceChart";
import WeightsInputTable from "./WeightsInputTable";
import BackTestResultTable from "./BackTestResultTable";
import { getAnnualizedReturns, getAnnualizedStd } from "utils/utils";

const BackTestPresenter = props => {
  const { data, client, columns, dataSource, func, resultList } = props;
  const { globalVariables } = data;
  const { runSimulation } = func;

  console.log(getAnnualizedReturns(0.23, 252));
  console.log(getAnnualizedStd(0.006736));
  console.log(resultList);

  const result = resultList.map(data => {
    const { result, name } = data;
    const { finalReturn, std, sharpeRatio } = result;

    return {
      name,
      returns: finalReturn,
      std
    };
  });

  // const result = [];
  return (
    <div>
      <WeightsInputTable
        columns={columns}
        dataSource={dataSource}
        runHandler={(weightsList, name) =>
          runSimulation(globalVariables, weightsList, name)
        }
      />
      <PriceChart data={data} resultList={resultList} />
      <BackTestResultTable data={result} />
    </div>
  );
};

export default BackTestPresenter;
