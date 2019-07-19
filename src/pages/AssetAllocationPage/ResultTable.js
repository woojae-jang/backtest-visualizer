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
  }
];

const ResultTable = props => {
  const floatingPoint = 2;
  const dataSource = props.data.map((data, index) => {
    let { code, returns, std, annualizedReturns, annualizedStd } = data;
    returns = math.round(returns, 4);
    std = math.round(std, 4);
    annualizedReturns = math.round(annualizedReturns, 4);
    annualizedStd = math.round(annualizedStd, 4);

    return {
      key: index,
      code,
      name: getAssetName(code),
      returns: (returns * 100).toFixed(floatingPoint) + " %",
      std: (std * 100).toFixed(floatingPoint) + " %",
      annualizedReturns:
        (annualizedReturns * 100).toFixed(floatingPoint) + " %",
      annualizedStd: (annualizedStd * 100).toFixed(floatingPoint) + " %"
    };
  });

  return <Table dataSource={dataSource} columns={columns} size="small" />;
};

export default ResultTable;
