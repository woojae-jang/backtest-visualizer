import React from "react";
import { Select } from "antd";

const Option = Select.Option;

class RebalanceSelect extends React.Component {
  render() {
    return (
      <Select
        defaultValue={this.props.preValue}
        style={{ width: 100 }}
        onChange={this.handleChange}
      >
        <Option value="none">None</Option>
        <Option value="daily">Daily</Option>
        <Option value="weekly">Weekly</Option>
        <Option value="monthly">Monthly</Option>
      </Select>
    );
  }

  handleChange = value => {
    this.props.handleChange(value);
  };
}

export default RebalanceSelect;
