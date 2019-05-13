import React from "react";
import { Select } from "antd";

const Option = Select.Option;

class StrategySelect extends React.Component {
  render() {
    return (
      <Select
        defaultValue="none"
        style={{ width: 150 }}
        onChange={this.handleChange}
      >
        <Option value="none">None</Option>
        <Option value="momentum">Momentum</Option>
        <Option value="momentum2-1">Momentum2-1</Option>
        <Option value="momentum2-2">Momentum2-2</Option>
        <Option value="momentum2-3">Momentum2-3</Option>
        <Option value="momentum2-4">Momentum2-4</Option>
        <Option value="momentum2-5">Momentum2-5</Option>
        <Option value="momentum2-6">Momentum2-6</Option>
        <Option value="momentum3">Momentum3</Option>
      </Select>
    );
  }

  handleChange = value => {
    this.props.handleChange(value);
  };
}

export default StrategySelect;
