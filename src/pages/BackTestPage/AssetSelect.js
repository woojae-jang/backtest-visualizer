import React from "react";
import { Select } from "antd";
import {  assetCodeList, assetShortNameList,} from "utils/data";

const Option = Select.Option;

class AssetSelect extends React.Component {
  render() {
    return (
      <Select
        defaultValue={this.props.preValue}
        style={{ width: 100 }}
        onChange={this.handleChange}
      >
        <Option value="none">None</Option>
		{assetCodeList.map((code, index) => <Option key={code} value={code}>{assetShortNameList[index]}</Option>)}
      </Select>
    );
  }

  handleChange = value => {
    this.props.handleChange(value);
  };
}

export default AssetSelect;