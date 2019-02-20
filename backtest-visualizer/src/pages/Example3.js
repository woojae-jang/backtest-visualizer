import React from "react";

class Example3 extends React.Component {
  render() {
    const { params } = this.props.match;

    return (
      <div>
        <h1>Example3</h1>
        <p>{params.id}</p>
      </div>
    );
  }
}
export default Example3;
