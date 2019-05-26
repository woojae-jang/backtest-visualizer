import React from "react";
import RebalanceSelect from "./RebalanceSelect";
import StrategySelect from "./StrategySelect";
import StrategyArgSelect from "./StrategyArgSelect";
import AssetSelect from "./AssetSelect";

const BatchSelect = props => {
  const { batchSelection } = props;
  // column 종류 : rebalanceType, strategyType, strategyArg1, strategyArg2, selectedAsset
  return (
    <React.Fragment>
      <RebalanceSelect
        handleChange={type => batchSelection("rebalanceType", type)}
        preValue="none"
      />

      <StrategySelect
        handleChange={type => batchSelection("strategyType", type)}
        preValue="none"
      />

      <StrategyArgSelect
        handleChange={type => batchSelection("strategyArg1", type)}
        preValue="none"
      />
      <StrategyArgSelect
        handleChange={type => batchSelection("strategyArg2", type)}
        preValue="none"
      />
      <StrategyArgSelect
        handleChange={type => batchSelection("strategyArg3", type)}
        preValue="none"
      />
      <AssetSelect
        handleChange={type => batchSelection("selectedAsset", type)}
        preValue="none"
      />
    </React.Fragment>
  );
};

export default BatchSelect;
