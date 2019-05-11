import React from "react";
import { Select } from "antd";

const Option = Select.Option;

class StrategySelect extends React.Component {
  render() {
    return (
      <Select
        defaultValue="none"
        style={{ width: 80 }}
        onChange={this.handleChange}
      >
        <Option value="none">None</Option>
        <Option value="momentum">Momentum</Option>
      </Select>
    );
  }

  handleChange = value => {
    this.props.handleChange(value);
  };
}

export default StrategySelect;
