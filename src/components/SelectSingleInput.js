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
        selectedCode: value
      }
    }
  });
}

const SelectSingleInput = props => {
  return (
    <Select
      style={{ width: "20%" }}
      placeholder="Please select"
      defaultValue={props.data.globalVariables.selectedCode}
      onChange={value => handleChange(value, props.client)}
    >
      {children}
    </Select>
  );
};

export default SelectSingleInput;
