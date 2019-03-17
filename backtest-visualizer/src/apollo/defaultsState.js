export const defaultsState = {
  globalVariables: {
    __typename: "GlobalVariables",
    startDate: "20161123",
    endDate: "20161206"
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
