export const defaultsState = {
  globalVariables: {
    __typename: "GlobalVariables",
    startDate: "20170306",
    endDate: "20170928",
    selectedCode: "069500",
    codeList: ["069500", "232080", "143850"],
    selectedAllocation: []
  },
  notes: [
    {
      __typename: "Note",
      id: 1,
      title: "First",
      content: "Second"
    }
  ],

  simulation: [
    {
      __typename: "Simulation",
      id: 0,
      startDate: null,
      endDate: null
    }
  ]
};
