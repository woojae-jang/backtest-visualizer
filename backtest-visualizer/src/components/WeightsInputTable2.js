import { Table } from "antd";
import React from "react";
import { InputNumber } from "antd";

class WeightsInputTable2 extends React.Component {
  render() {
    const { codeList } = this.props.data.globalVariables;
    const dataSource = this.createDataSource(codeList);
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

  createDataSource = codeList => {
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
          onChange={val => this.onChange(val, data.key, "minWeight")}
        />
      );

      dataSource[index].maxWeight = (
        <InputNumber
          min={0}
          max={100}
          defaultValue={100}
          onChange={val => this.onChange(val, data.key, "maxWeight")}
        />
      );
    });
    return dataSource;
  };

  onChange = (value, index, col) => {
    const client = this.props.client;
    const code = this.props.data.globalVariables.codeList[index];

    console.log(client);
    console.log(code);
    console.log("changed", value, index, col);
  };
}

export default WeightsInputTable2;
