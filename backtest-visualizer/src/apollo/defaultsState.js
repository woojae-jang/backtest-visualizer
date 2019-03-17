export const defaultsState = {
  globalVariables: {
    __typename: "GlobalVariables",
    startDate: "20161123",
    endDate: "20161206",
    codeList: [
      "069500",
      "232080",
      "143850"
      // "195930",
      // "238720",
      // "192090",
      // "148070",
      // "136340",
      // "182490",
      // "132030",
      // "130680",
      // "114800",
      // "138230",
      // "139660",
      // "130730"
    ]
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
