import React from "react";

class Example2 extends React.Component {
  onSubmit = () => {
    this.props.history.push("/");
  };

  render() {
    return (
      <form>
        <input placeholder="name" type="name" />
        <input placeholder="email" type="email" />
        <button onClick={this.onSubmit}>Submit</button>
      </form>
    );
  }
}
export default Example2;
