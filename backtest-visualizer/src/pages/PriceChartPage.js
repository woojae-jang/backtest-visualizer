import React from "react";
import "./PriceChartPage.css";
import { GET_GLOBAL_VARIABLES } from "../apollo/queries";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import { Query } from "react-apollo";
import * as moment from "moment";
import PriceChart from "../components/PriceChart";

const { RangePicker } = DatePicker;

const dateFormat = "YYYYMMDD";

class PriceChartPage extends React.Component {
  onChnage = (date, client) => {
    const startDate = date[0].format(dateFormat);
    const endDate = date[1].format(dateFormat);
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
      <div id="chart">
        <h1>PriceChart</h1>
        <Query query={GET_GLOBAL_VARIABLES}>
          {({ loading, error, data, client }) => {
            const { startDate, endDate } = data.globalVariables;
            return (
              <div>
                <RangePicker
                  onChange={date => this.onChnage(date, client)}
                  defaultValue={[
                    moment(startDate, dateFormat),
                    moment(endDate, dateFormat)
                  ]}
                  format={dateFormat}
                />
                <PriceChart data={data} />
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default PriceChartPage;
