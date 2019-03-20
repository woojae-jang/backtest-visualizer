import { Select } from "antd";
import React from "react";

const Option = Select.Option;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
  console.log(`selected ${value}`);
}

const SelectInput = props => {
  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder="Please select"
      defaultValue={["a10", "c12"]}
      onChange={handleChange}
    >
      {children}
    </Select>
  );
};

export default SelectInput;
