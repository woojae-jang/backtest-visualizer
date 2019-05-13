import React from "react";
import { Select } from "antd";

const Option = Select.Option;

class StrategyArgSelect extends React.Component {
  render() {
    return (
      <Select
        defaultValue="none"
        style={{ width: 60 }}
        onChange={this.handleChange}
      >
        <Option value="none">None</Option>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">3</Option>
        <Option value="10">10</Option>
        <Option value="20">20</Option>
        <Option value="30">30</Option>
      </Select>
    );
  }

  handleChange = value => {
    this.props.handleChange(value);
  };
}

export default StrategyArgSelect;
