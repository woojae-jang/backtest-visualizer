import React from "react";
import PriceChart from "./PriceChart";
import WeightsInputTable from "./WeightsInputTable";
import BackTestResultTable from "./BackTestResultTable";
import PortFolioPositionChart from "./PortFolioPositionChart";
import StrategyDescription from "./StrategyDescription";
import { getAnnualizedReturns, getAnnualizedStd } from "utils/utils";
import { Button } from "antd";

const BackTestPresenter = props => {
  const {
    data,
    client,
    columns,
    dataSource,
    func,
    resultList,
    selectedPortfolio,
    selectPortfolioHandler,
    refreshHandler,
    rootComp
  } = props;
  const { globalVariables } = data;
  const { runSimulation } = func;

  return (
    <div>
      <StrategyDescription />
      <WeightsInputTable
        columns={columns}
        dataSource={dataSource}
        runHandler={(
          weightsList,
          name,
          rebalanceType,
          strategyType,
          strategyArg1,
          strategyArg2,
          selectedAsset
        ) =>
          runSimulation(
            globalVariables,
            weightsList,
            name,
            rebalanceType,
            strategyType,
            strategyArg1,
            strategyArg2,
            selectedAsset
          )
        }
        rootComp={rootComp}
      />
      <Button type="default" onClick={() => refreshHandler(globalVariables)}>
        Refresh
      </Button>
      <PriceChart
        data={data}
        resultList={resultList}
        selectPortfolio={selectPortfolioHandler}
      />
      <BackTestResultTable data={resultList} />
      <PortFolioPositionChart
        resultList={resultList}
        portInfo={selectedPortfolio}
      />
    </div>
  );
};

export default BackTestPresenter;
