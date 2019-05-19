import React from "react";
import { Route, Link } from "react-router-dom";

const Example3 = ({ match }) => <p>{match.params.id}</p>;

class Example3s extends React.Component {
  render() {
    return (
      <div>
        <h1>Example3</h1>
        <ul>
          <li>
            <Link to="/example3/1">example3 1 </Link>
          </li>
          <li>
            <Link to="/example3/2">example3 2 </Link>
          </li>
          <li>
            <Link to="/example3/3">example3 3 </Link>
          </li>
        </ul>
        <Route path="/example3/:id" component={Example3} />
      </div>
    );
  }
}
export default Example3s;
