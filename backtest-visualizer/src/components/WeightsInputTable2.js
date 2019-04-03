import { Table } from "antd";
import React from "react";
import { InputNumber } from "antd";
import { getAssetName } from "utils/data";

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
        title: "Name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Weight",
        dataIndex: "weight",
        key: "weight"
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
        code,
        name: getAssetName(code)
      };
    });

    dataSource.forEach((data, index) => {
      [
        { col: "weight", defaultValue: null },
        { col: "minWeight", defaultValue: 0 },
        { col: "maxWeight", defaultValue: 100 }
      ].forEach(
        obj =>
          (dataSource[index][obj.col] = (
            <InputNumber
              min={0}
              max={100}
              defaultValue={obj.defaultValue}
              onChange={val => this.onChange(val, data.key, obj.col)}
            />
          ))
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
