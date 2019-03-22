import { Table } from "antd";
import React from "react";
import * as math from "mathjs";
import { getAssetName } from "utils/data";

// const dataSource = [
//   {
//     key: "1",
//     code: "123456",
//     returns: 0.23,
//     std: 0.13
//   },
//   {
//     key: "2",
//     code: "654321",
//     returns: 0.15,
//     std: 0.11
//   }
// ];

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

// class ResultTable extends React.Component {
//   render() {
//     return <Table dataSource={dataSource} columns={columns} />;
//   }
// }

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
