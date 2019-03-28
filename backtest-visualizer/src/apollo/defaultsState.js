export const defaultsState = {
  globalVariables: {
    __typename: "GlobalVariables",
    startDate: "20170502",
    endDate: "20171031",
    selectedCode: "069500",
    codeList: ["069500", "232080", "143850"],
    selectedAllocation: []
  },

  correlationPage: {
    __typename: "CorrelationPage",
    one: "069500",
    another: "232080"
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
