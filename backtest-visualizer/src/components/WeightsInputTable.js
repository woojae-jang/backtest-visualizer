import { Table } from "antd";
import React from "react";
import NumericInput from "./NumericInput ";

class WeightsInputTable extends React.Component {
  render() {
    return (
      <Table dataSource={this.state.dataSource} columns={this.state.columns} />
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [
        {
          key: "1",
          code: "123456",
          returns: 0.23,
          std: (
            <NumericInput
              value={0}
              onChange={e => this.onChange(e, "1")}
              style={{ width: 120 }}
            />
          )
        },
        {
          key: "2",
          code: "654321",
          returns: 0.15,
          std: (
            <NumericInput
              value={0}
              onChange={e => this.onChange(e, "2")}
              style={{ width: 120 }}
            />
          )
        }
      ],

      columns: [
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
      ]
    };
  }

  onChange = (value, key) => {
    const state = this.state;
    const newState = {
      columns: state.columns,
      dataSource: state.dataSource.map((data, index) => {
        if (data.key === key) {
          return {
            key: data.key,
            code: data.code,
            returns: data.returns,
            std: (
              <NumericInput
                onChange={e => this.onChange(e, key)}
                value={value}
                style={{ width: 120 }}
              />
            )
          };
        } else {
          return data;
        }
      })
    };

    this.setState(newState);
  };
}

export default WeightsInputTable;
