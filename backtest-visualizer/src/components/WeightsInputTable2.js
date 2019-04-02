import { Table } from "antd";
import React from "react";
import { InputNumber } from "antd";

function onChange(value, index, col) {
  console.log("changed", value, index, col);
}

const createDataSource = codeList => {
  const dataSource = codeList.map((code, index) => {
    return {
      key: index,
      code
    };
  });
  dataSource.forEach((data, index) => {
    dataSource[index].minWeight = (
      <InputNumber
        min={0}
        max={100}
        defaultValue={0}
        onChange={val => onChange(val, data.key, "minWeight")}
      />
    );

    dataSource[index].maxWeight = (
      <InputNumber
        min={0}
        max={100}
        defaultValue={100}
        onChange={val => onChange(val, data.key, "maxWeight")}
      />
    );
  });
  return dataSource;
};

class WeightsInputTable2 extends React.Component {
  render() {
    const { codeList } = this.props.data.globalVariables;
    const dataSource = createDataSource(codeList);
    const columns = [
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
    ];

    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        bordered={true}
      />
    );
  }
}

export default WeightsInputTable2;
