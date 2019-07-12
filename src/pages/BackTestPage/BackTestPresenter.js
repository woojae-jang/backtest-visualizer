import React from "react";
import PriceChart from "./PriceChart";
import WeightsInputTable from "./WeightsInputTable";
import BackTestResultTable from "./BackTestResultTable";
import PortFolioPositionChart from "./PortFolioPositionChart";
import StrategyDescription from "./StrategyDescription";
import { Switch } from "antd";
import { Button } from "antd";
import GridLayout from "react-grid-layout";

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

  var layout = [
    { i: "a", x: 0, y: 0, w: 12, h: 4, static: true },
    { i: "b", x: 0, y: 4, w: 12, h: 12, static: true },
    { i: "c", x: 0, y: 16, w: 7, h: 15, static: true },
    { i: "d", x: 7, y: 16, w: 5, h: 15, static: true },
    { i: "e", x: 0, y: 31, w: 12, h: 10, static: true }
  ];

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1600}
    >
      <div key="a">
        <StrategyDescription />
      </div>
      <div key="b">
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
      </div>
      <div key="c">
        <PriceChart
          data={data}
          resultList={resultList}
          selectPortfolio={selectPortfolioHandler}
          isLogScale={isLogScale}
        />
        {/* <span>Returns Log scale </span>
        <Switch onChange={setLogScale} /> */}
      </div>
      <div key="d">
        <PortFolioPositionChart
          resultList={resultList}
          portInfo={selectedPortfolio}
        />
      </div>
      <div key="e">
        <BackTestResultTable data={resultList} />
      </div>
    </GridLayout>
  );
};

export default BackTestPresenter;
