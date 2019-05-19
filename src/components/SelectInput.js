import { Select } from "antd";
import React from "react";
import { assetCodeList, assetNameList } from "utils/data";

const Option = Select.Option;

const codeList = assetCodeList;
const nameList = assetNameList;

const children = [];

for (let i = 0; i < codeList.length; i++) {
  children.push(<Option key={codeList[i]}>{nameList[i]}</Option>);
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
