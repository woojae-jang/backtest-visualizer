import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {
  Route,
  NavLink,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";
import Example1 from "./pages/Example1";
import Example2 from "./pages/Example2";
import Example3s from "./pages/Example3";
import Example4 from "./pages/Example4";
import Notfound from "./pages/notfound";

const routing = (
  <Router>
    <div>
      <ul>
        <li>
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/example1">
            Example1
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/example2">
            Example2
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/example3">
            Example3
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/example4">
            Example4
          </NavLink>
        </li>
      </ul>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/example1" component={Example1} />
        <Route path="/example2" component={Example2} />
        <Route path="/example3" component={Example3s} />
        <Route path="/example4" component={Example4} />
        <Route component={Notfound} />
      </Switch>
    </div>
  </Router>
);
ReactDOM.render(routing, document.getElementById("root"));
