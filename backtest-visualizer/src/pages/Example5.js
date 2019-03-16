import React from "react";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import { Query } from "react-apollo";
import { GET_SIMULATION, GET_GLOBAL_VARIABLES } from "../apollo/queries";

const { RangePicker } = DatePicker;

function onChange(date) {
  const startDate = date[0].format("YYYYMMDD");
  const endDate = date[1].format("YYYYMMDD");
  console.log(startDate, endDate);
}

class Example5 extends React.Component {
  render() {
    return (
      <div>
        <h1>Example5</h1>
        <RangePicker onChange={onChange} />
        <Query query={GET_GLOBAL_VARIABLES}>
          {({ loading, error, data }) => {
            console.log(data);
            return [];
          }}
        </Query>

        <Query query={GET_SIMULATION}>
          {({ loading, error, data }) => {
            console.log(data.simulation);
            return [];
          }}
        </Query>
      </div>
    );
  }
}
export default Example5;
