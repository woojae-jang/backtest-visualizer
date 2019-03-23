import { Table } from "antd";
import React from "react";
import * as math from "mathjs";
import { getAssetName } from "utils/data";

const columns = [
  {
    title: "Code",
    dataIndex: "code",
    key: "code"
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Returns",
    dataIndex: "returns",
    key: "returns"
  },
  {
    title: "Std",
    dataIndex: "std",
    key: "std"
  }
];

const ResultTable = props => {
  const dataSource = props.data.map((data, index) => {
    let { code, returns, std } = data;
    returns = math.round(returns, 4);
    std = math.round(std, 4);
    return {
      key: index,
      code,
      name: getAssetName(code),
      returns,
      std
    };
  });

  return <Table dataSource={dataSource} columns={columns} />;
};

export default ResultTable;
