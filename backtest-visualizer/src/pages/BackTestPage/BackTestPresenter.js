import React from "react";
import PriceChart from "./PriceChart";
import { Button } from "antd";
import WeightsInputTable3 from "components/WeightsInputTable3";
import BackTestResultTable from "./BackTestResultTable";

const BackTestPresenter = props => {
  const { data, client, columns, dataSource, func, resultList } = props;
  const { globalVariables } = data;
  const resultDataSource = [];
  const { runSimulation } = func;

  return (
    <div>
      <WeightsInputTable3
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
