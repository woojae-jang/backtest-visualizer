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
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate"
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate"
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
    let {
      finalReturn,
      std,
      annualizedReturns,
      annualizedStd,
      dateList
    } = result;
    const startDate = dateList[0];
    const endDate = dateList[dateList.length - 1];
    const returns = math.round(finalReturn, 4);
    std = math.round(std, 4);
    annualizedReturns = math.round(annualizedReturns, 4);
    annualizedStd = math.round(annualizedStd, 4);
    return {
      key: index,
      name: name,
      startDate,
      endDate,
      returns: (returns * 100).toFixed(2) + " %",
      std: (std * 100).toFixed(2) + " %",
      annualizedReturns: (annualizedReturns * 100).toFixed(2) + " %",
      annualizedStd: (annualizedStd * 100).toFixed(2) + " %",
      sharpeRatio: math.round(annualizedReturns / annualizedStd, 2).toFixed(2)
    };
  });

  return <Table dataSource={dataSource} columns={columns} size="small" />;
};

export default BackTestResultTable;
