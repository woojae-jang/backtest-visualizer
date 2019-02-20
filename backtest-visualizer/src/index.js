import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";
import Example1 from "./pages/Example1";
import Example2 from "./pages/Example2";
import Notfound from "./pages/notfound";

const routing = (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/example1">Example1</Link>
        </li>
        <li>
          <Link to="/example2">Example2</Link>
        </li>
      </ul>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/example1" component={Example1} />
        <Route path="/example2" component={Example2} />
        <Route component={Notfound} />
      </Switch>
    </div>
  </Router>
);
ReactDOM.render(routing, document.getElementById("root"));
