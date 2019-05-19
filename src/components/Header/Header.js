import React, { Component } from "react";
import { Query } from "react-apollo";
import { GET_GLOBAL_VARIABLES } from "apollo/queries";
import MarketCalendar from "components/MarketCalendar";

class Header extends Component {
  render() {
    return (
      <Query query={GET_GLOBAL_VARIABLES}>
        {({ loading, error, data, client }) => {
          return (
            <React.Fragment>
              <MarketCalendar data={data} client={client} />
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default Header;
