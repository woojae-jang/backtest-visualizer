import React from "react";
import PriceChart from "./PriceChart";
import WeightsInputTable from "./WeightsInputTable";
import BackTestResultTable from "./BackTestResultTable";

const BackTestPresenter = props => {
  const { data, client, columns, dataSource, func, resultList } = props;
  const { globalVariables } = data;
  const resultDataSource = [];
  const { runSimulation } = func;

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
      <BackTestResultTable data={resultDataSource} />
    </div>
  );
};

export default BackTestPresenter;
