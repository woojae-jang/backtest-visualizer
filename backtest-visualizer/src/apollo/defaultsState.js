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
    another: "232080",
    rolling: null,
    baseDate: null
  },

  assetAllocationPage: {
    __typename: "AssetAllocationPage",
    weightLimit: {
      __typename: "weightLimit",
      "069500": { __typename: "weightRange", minWeight: 0, maxWeight: 100 },
      "232080": { __typename: "weightRange", minWeight: 0, maxWeight: 100 },
      "143850": { __typename: "weightRange", minWeight: 0, maxWeight: 100 },
      "195930": { __typename: "weightRange", minWeight: 0, maxWeight: 100 },
      "238720": { __typename: "weightRange", minWeight: 0, maxWeight: 100 },
      "192090": { __typename: "weightRange", minWeight: 0, maxWeight: 100 },
      "148070": { __typename: "weightRange", minWeight: 0, maxWeight: 100 },
      "136340": { __typename: "weightRange", minWeight: 0, maxWeight: 100 },
      "182490": { __typename: "weightRange", minWeight: 0, maxWeight: 100 },
      "132030": { __typename: "weightRange", minWeight: 0, maxWeight: 100 },
      "130680": { __typename: "weightRange", minWeight: 0, maxWeight: 100 },
      "114800": { __typename: "weightRange", minWeight: 0, maxWeight: 100 },
      "138230": { __typename: "weightRange", minWeight: 0, maxWeight: 100 },
      "139660": { __typename: "weightRange", minWeight: 0, maxWeight: 100 },
      "130730": { __typename: "weightRange", minWeight: 0, maxWeight: 100 }
    }
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
