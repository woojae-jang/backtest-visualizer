import React from "react";
import { Select } from "antd";

const Option = Select.Option;

class StrategySelect extends React.Component {
  render() {
    return (
      <Select
        defaultValue={this.props.preValue}
        style={{ width: 150 }}
        onChange={this.handleChange}
      >
        <Option value="none">None</Option>
        <Option value="momentum">Momentum</Option>
        <Option value="momentum2">Momentum2</Option>
        <Option value="momentum3">Momentum3</Option>
        <Option value="momentum4">Momentum4</Option>
        <Option value="momentum5">Momentum5</Option>
        <Option value="momentum6">Momentum6</Option>
        <Option value="momentum7">Momentum7</Option>
      </Select>
    );
  }

  handleChange = value => {
    this.props.handleChange(value);
  };
}

export default StrategySelect;
