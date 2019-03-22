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

const nameList = [
  "KODEX200",
  "TIGER코스닥150",
  "TIGER미국S&P500선물(H)",
  "TIGER유로스탁스50(합성H)",
  "KINDEX일본Nikkei225(H)",
  "TIGER차이나CSI300",
  "KOSEF국고채10년",
  "KBSTAR중기우량회사채",
  "TIGER단기선진하이일드(합성H)",
  "KODEX골드선물(H)",
  "TIGER원유선물Enhanced(H)",
  "KODEX인버스",
  "KOSEF미국달러선물",
  "KOSEF미국달러선물인버스",
  "KOSEF단기자금"
];

// 069500	KODEX200
// 232080	TIGER코스닥150
// 143850	TIGER미국S&P500선물(H)
// 195930	TIGER유로스탁스50(합성H)
// 238720	KINDEX일본Nikkei225(H)
// 192090	TIGER차이나CSI300
// 148070	KOSEF국고채10년
// 136340	KBSTAR중기우량회사채
// 182490	TIGER단기선진하이일드(합성H)
// 132030	KODEX골드선물(H)
// 130680	TIGER원유선물Enhanced(H)
// 114800	KODEX인버스
// 138230	KOSEF미국달러선물
// 139660	KOSEF미국달러선물인버스
// 130730	KOSEF단기자금

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
