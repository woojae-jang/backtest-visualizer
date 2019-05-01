import React from "react";
import SelectInput from "components/SelectInput";
import ReturnsChart from "components/ReturnsChart";
import DoughnutChart from "components/DoughnutChart";
import { Button } from "antd";
import WeightsInputTable2 from "components/WeightsInputTable2";

const BackTestPresenter = props => {
  const { data, client, stateData } = props;

  return (
    <div>
      <div className="asset-allocation-page">
        <SelectInput data={data} client={client} />
        <ReturnsChart data={data} />
        <DoughnutChart data={data} />
      </div>
    </div>
  );
};

export default BackTestPresenter;
