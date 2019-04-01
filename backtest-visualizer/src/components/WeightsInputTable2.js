import { Table } from "antd";
import React from "react";
import { InputNumber } from "antd";

function onChange(value, index, col) {
  console.log("changed", value, index, col);
}

const codeList = ["123456", "654321", "111111", "222222", "333333"];
const defaultDataSource = codeList.map((code, index) => {
  return {
    key: index,
    code
  };
});

defaultDataSource.forEach((data, index) => {
  defaultDataSource[index].minWeight = (
    <InputNumber
      min={0}
      max={100}
      defaultValue={0}
      onChange={val => onChange(val, data.key, "minWeight")}
    />
  );

  defaultDataSource[index].maxWeight = (
    <InputNumber
      min={0}
      max={100}
      defaultValue={100}
      onChange={val => onChange(val, data.key, "maxWeight")}
    />
  );
});

class WeightsInputTable2 extends React.Component {
  render() {
    return (
      <Table dataSource={this.state.dataSource} columns={this.state.columns} />
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      dataSource: defaultDataSource,

      columns: [
        {
          title: "Code",
          dataIndex: "code",
          key: "code"
        },
        {
          title: "MinWeight",
          dataIndex: "minWeight",
          key: "minWeight"
        },
        {
          title: "MaxWeight",
          dataIndex: "maxWeight",
          key: "maxWeight"
        }
      ]
    };
  }
}

export default WeightsInputTable2;
