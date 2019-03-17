import React from "react";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import { Query } from "react-apollo";
import { GET_SIMULATION, GET_GLOBAL_VARIABLES } from "../apollo/queries";

const { RangePicker } = DatePicker;

class Example5 extends React.Component {
  onChnage = (date, client) => {
    const startDate = date[0].format("YYYYMMDD");
    const endDate = date[1].format("YYYYMMDD");
    client.writeData({
      data: {
        globalVariables: {
          __typename: "GlobalVariables",
          startDate,
          endDate
        }
      }
    });
  };

  render() {
    return (
      <div>
        <h1>Example5</h1>
        <Query query={GET_GLOBAL_VARIABLES}>
          {({ loading, error, data, client }) => {
            console.log(data);
            return (
              <div>
                <RangePicker onChange={date => this.onChnage(date, client)} />
                <li>{data.globalVariables.startDate}</li>
                <li>{data.globalVariables.endDate}</li>
              </div>
            );
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
