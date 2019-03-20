import { Table } from "antd";
import React from "react";

const dataSource = [
  {
    key: "1",
    code: "123456",
    returns: 0.23,
    std: 0.13
  },
  {
    key: "2",
    code: "654321",
    returns: 0.15,
    std: 0.11
  }
];

const columns = [
  {
    title: "Code",
    dataIndex: "code",
    key: "code"
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
  return <Table dataSource={dataSource} columns={columns} />;
};

export default ResultTable;
