import React from "react";
import SelectSingleInput from "./SelectSingleInput";

const labelList = ["Start Date", "End Date", "Rebalancing", "Benchmark"];
const inputList = [
  <SelectSingleInput />,
  <SelectSingleInput />,
  <SelectSingleInput />,
  <SelectSingleInput />
];

const InputForm = props => {
  return (
    <div>
      <h1>InputForm</h1>
      {labelList.map((label, index) => (
        <div key={label}>
          <label>{label}</label>
          {inputList[index]}
        </div>
      ))}
    </div>
  );
};

export default InputForm;
