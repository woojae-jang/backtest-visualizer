import React from "react";
import PriceChart from "./PriceChart";
import WeightsInputTable from "./WeightsInputTable";
import BackTestResultTable from "./BackTestResultTable";
import PortFolioPositionChart from "./PortFolioPositionChart";
import { getAnnualizedReturns, getAnnualizedStd } from "utils/utils";

const BackTestPresenter = props => {
  const {
    data,
    client,
    columns,
    dataSource,
    func,
    resultList,
    selectedPortfolio,
    selectPortfolioHandler
  } = props;
  const { globalVariables } = data;
  const { runSimulation } = func;

  return (
    <div>
      <WeightsInputTable
        columns={columns}
        dataSource={dataSource}
        runHandler={(weightsList, name, rebalanceType, strategyType, strategyArg1,strategyArg2) =>
          runSimulation(
            globalVariables,
            weightsList,
            name,
            rebalanceType,
            strategyType,
            strategyArg1,
            strategyArg2
          )
        }
      />
      <PriceChart
        data={data}
        resultList={resultList}
        selectPortfolio={selectPortfolioHandler}
      />
      <PortFolioPositionChart
        resultList={resultList}
        portInfo={selectedPortfolio}
      />
      <BackTestResultTable data={resultList} />
    </div>
  );
};

export default BackTestPresenter;
