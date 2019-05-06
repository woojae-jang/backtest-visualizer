import { Table } from "antd";
import React from "react";
import * as math from "mathjs";
import { getAssetName } from "utils/data";

const columns = [
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

const BackTestResultTable = props => {
  const dataSource = props.data.map((data, index) => {
    let { returns, std, name } = data;
    returns = math.round(returns, 4);
    std = math.round(std, 4);
    return {
      key: index,
      name: name,
      returns,
      std
    };
  });

  return <Table dataSource={dataSource} columns={columns} size="small" />;
};

export default BackTestResultTable;
