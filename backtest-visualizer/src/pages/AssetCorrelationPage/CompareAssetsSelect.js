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

function handleOneChange(value, client) {
  client.writeData({
    data: {
      correlationPage: {
        __typename: "correlationPage",
        one: value
      }
    }
  });
}

function handleAnotherChange(value, client) {
  client.writeData({
    data: {
      correlationPage: {
        __typename: "correlationPage",
        another: value
      }
    }
  });
}

const CompareAssetsSelect = props => {
  return (
    <React.Fragment>
      <Select
        style={{ width: "20%" }}
        placeholder="Please select"
        defaultValue={props.data.correlationPage.one}
        onChange={value => handleOneChange(value, props.client)}
      >
        {children}
      </Select>
      <Select
        style={{ width: "20%" }}
        placeholder="Please select"
        defaultValue={props.data.correlationPage.another}
        onChange={value => handleAnotherChange(value, props.client)}
      >
        {children}
      </Select>
    </React.Fragment>
  );
};

export default CompareAssetsSelect;
