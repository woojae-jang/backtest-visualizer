import { Table } from "antd";
import React from "react";
import * as math from "mathjs";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Returns(%)",
    dataIndex: "returns",
    key: "returns"
  },
  {
    title: "Std(%)",
    dataIndex: "std",
    key: "std"
  },
  {
    title: "AnnualizedReturns(%)",
    dataIndex: "annualizedReturns",
    key: "annualizedReturns"
  },
  {
    title: "AnnualizedStd(%)",
    dataIndex: "annualizedStd",
    key: "annualizedStd"
  },
  {
    title: "SharpeRatio",
    dataIndex: "sharpeRatio",
    key: "sharpeRatio"
  }
];

const BackTestResultTable = props => {
  const dataSource = props.data.map((d, index) => {
    const { result, name } = d;
    let { finalReturn, std, annualizedReturns, annualizedStd } = result;
    const returns = math.round(finalReturn, 4);
    std = math.round(std, 4);
    annualizedReturns = math.round(annualizedReturns, 4);
    annualizedStd = math.round(annualizedStd, 4);
    return {
      key: index,
      name: name,
      returns: returns * 100 + " %",
      std: std * 100 + " %",
      annualizedReturns: annualizedReturns * 100 + " %",
      annualizedStd: annualizedStd * 100 + " %",
      sharpeRatio: math.round(annualizedReturns / annualizedStd, 2)
    };
  });

  return <Table dataSource={dataSource} columns={columns} size="small" />;
};

export default BackTestResultTable;
