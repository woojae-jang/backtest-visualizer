import React from "react";
import PriceChart from "./PriceChart";
import WeightsInputTable from "./WeightsInputTable";
import BackTestResultTable from "./BackTestResultTable";
import PortFolioPositionChart from "./PortFolioPositionChart";
import StrategyDescription from "./StrategyDescription";
import { Switch } from "antd";
import { Button } from "antd";
import styled from "styled-components";

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
    rootComp,
    setLogScale,
    isLogScale,
    batchSelection
  } = props;
  const { globalVariables } = data;
  const { runSimulation } = func;

  return (
    <Container>
      <StrategyDescriptionContainer>
        <StrategyDescription />
      </StrategyDescriptionContainer>
      <StrategyInputContainer>
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
            strategyArg3,
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
              strategyArg3,
              selectedAsset
            )
          }
          rootComp={rootComp}
          batchSelection={batchSelection}
        />
        <Button type="default" onClick={() => refreshHandler(globalVariables)}>
          Refresh
        </Button>
      </StrategyInputContainer>

      <ChartContainer>
        <PriceChartContainer>
          <PriceChart
            data={data}
            resultList={resultList}
            selectPortfolio={selectPortfolioHandler}
            isLogScale={isLogScale}
          />
          {/* <span>Returns Log scale </span>
        <Switch onChange={setLogScale} /> */}
        </PriceChartContainer>
        <PortFolioPositionChartContainer>
          <PortFolioPositionChart
            resultList={resultList}
            portInfo={selectedPortfolio}
          />
        </PortFolioPositionChartContainer>
      </ChartContainer>

      <BackTestResultTable data={resultList} />
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
  min-width: 1500px;
`;

const StrategyDescriptionContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const StrategyInputContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

const PriceChartContainer = styled.div`
  height: 100%;
  width: 60%;
`;

const PortFolioPositionChartContainer = styled.div`
  height: 100%;
  width: 40%;
`;

export default BackTestPresenter;
