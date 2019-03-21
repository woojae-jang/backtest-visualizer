import { Select } from "antd";
import React from "react";

const Option = Select.Option;

const codeList = [
  "069500",
  "232080",
  "143850",
  "195930",
  "238720",
  "192090",
  "148070",
  "136340",
  "182490",
  "132030",
  "130680",
  "114800",
  "138230",
  "139660",
  "130730"
];

const children = [];

for (let i = 0; i < codeList.length; i++) {
  children.push(<Option key={codeList[i]}>{codeList[i]}</Option>);
}

function handleChange(value, client) {
  client.writeData({
    data: {
      globalVariables: {
        __typename: "GlobalVariables",
        codeList: value
      }
    }
  });
}

const SelectInput = props => {
  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder="Please select"
      defaultValue={props.data.globalVariables.codeList}
      onChange={value => handleChange(value, props.client)}
    >
      {children}
    </Select>
  );
};

export default SelectInput;
