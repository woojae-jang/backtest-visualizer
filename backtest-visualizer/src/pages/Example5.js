import React from "react";
import { DatePicker } from "antd";
import "antd/dist/antd.css";

const { RangePicker } = DatePicker;

function onChange(date, dateString) {
  console.log(date, dateString);
}

class Example5 extends React.Component {
  render() {
    return (
      <div>
        <h1>Example5</h1>
        <RangePicker onChange={onChange} />
      </div>
    );
  }
}
export default Example5;
