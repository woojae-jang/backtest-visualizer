import {
  NOTE_FRAGMENT,
  SIMULATION_FRAGMENT,
  PRICE_LIST_FRAGMENT
} from "./fragments";
import { GET_NOTES } from "./queries";

export const defaults = {
  priceList: [
    {
      __typename: "PriceList",
      code: "069500",
      closePrice: [
        26845,
        26755,
        27160,
        27325,
        27635,
        27160,
        27415,
        27365,
        27200,
        26990,
        26630,
        26800,
        26830,
        26960,
        27230,
        27135,
        27155,
        26885,
        26955,
        27160,
        27090,
        27255,
        27025,
        27165,
        26975,
        27275,
        26280,
        26390,
        26270,
        26170,
        26385,
        26810,
        27245,
        27385,
        28035,
        27980,
        27870,
        28120,
        27760,
        27835,
        27990,
        27720,
        28915,
        29105,
        29250,
        29295,
        29755,
        30120,
        30125,
        30315,
        30085,
        29965,
        29685,
        29660,
        29530,
        29765,
        29300,
        29260,
        29290,
        29385,
        29320,
        29485,
        29530,
        29915,
        29785,
        29960,
        29840,
        29825,
        29740,
        29720,
        29570,
        29455,
        29335,
        29230,
        28915,
        28890,
        28880,
        29165,
        29035,
        29425,
        29750,
        29765,
        29760,
        29560,
        29605,
        29375,
        29910,
        29805,
        29765,
        29900,
        29810,
        29610,
        29665,
        29575,
        29815,
        29670,
        29750,
        29820,
        29855,
        29945,
        29650,
        29560,
        29730,
        29690,
        29470,
        29260,
        29330,
        29415,
        29375,
        30045,
        29980,
        30250,
        30360,
        30395,
        30410,
        30180,
        30440,
        30225,
        30620,
        30990,
        31145,
        31725,
        31765,
        31490,
        31800,
        31525,
        31455,
        31290,
        31100,
        30975,
        31650,
        31945,
        31810,
        31760,
        31860,
        31645,
        31595,
        31495,
        31610,
        31510,
        31800,
        31865,
        31670,
        31455,
        31560,
        31705,
        31960,
        32070,
        32300,
        32090,
        32260,
        31860,
        32065,
        32245,
        32265,
        32480,
        32300,
        31945,
        31990,
        31965,
        31755,
        31760,
        31860,
        31830,
        31610,
        31765,
        31330,
        31820,
        31885,
        31960,
        31880,
        31620,
        32015,
        31880,
        31605,
        32695,
        32570,
        32565,
        32410,
        32645,
        32705,
        32590,
        32615,
        32465,
        32180,
        31815,
        31495,
        31455,
        30835,
        31245,
        31690,
        32055,
        32155,
        32100,
        31605,
        31815,
        31650,
        32020,
        31855,
        31445,
        31205,
        30860,
        31700,
        31435,
        32250,
        32715,
        33065,
        33715,
        33705,
        33680
      ]
    }
  ],

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

export const typeDefs = `
    schema {
        query: Query
        mutation: Mutation
    }
    type Query {
        notes: [Note]!
        note(id: Int!): Note
        simulation: Simulation
        priceList(code: String!):  
    }
    type Mutation{
        createNote(title: String!, content: String!): Note
        editNote(id: Int!, title: String, content:String): Note
    }
    type Note{
        id: Int!
        title: Stirng!
        content: String!
    }

    type Simulation{
        id: Int
        startDate: String
        endDate: String
    }

    type PriceList{
        code: String!
        closePrice: [Int]!
    }
    `;

export const resolvers = {
  Query: {
    note: (_, variables, { cache }) => {
      const id = cache.config.dataIdFromObject({
        __typename: "Note",
        id: variables.id
      });
      const note = cache.readFragment({ fragment: NOTE_FRAGMENT, id });
      return note;
    },

    simulation: (_, variables, { cache }) => {
      const simulation = cache.readFragment({
        fragment: SIMULATION_FRAGMENT,
        id: 0
      });
      console.log("simulation");
      console.log(simulation);
      return simulation;
    },

    priceList: (_, variables, { cache }) => {
      const code = cache.config.dataIdFromObject({
        __typename: "PriceList",
        code: variables.code
      });
      const priceList = cache.readFragment({
        fragment: PRICE_LIST_FRAGMENT,
        code
      });

      return priceList;
    }
  },
  Mutation: {
    createNote: (_, variables, { cache }) => {
      const { notes } = cache.readQuery({ query: GET_NOTES });
      const { title, content } = variables;
      const newNote = {
        __typename: "Note",
        title,
        content,
        id: notes.length + 1
      };
      cache.writeData({
        data: {
          notes: [newNote, ...notes]
        }
      });
      return newNote;
    },

    editNote: (_, { id, title, content }, { cache }) => {
      const noteId = cache.config.dataIdFromObject({
        __typename: "Note",
        id
      });
      const note = cache.readFragment({ fragment: NOTE_FRAGMENT, id: noteId });
      const updatedNote = {
        ...note,
        title,
        content
      };
      cache.writeFragment({
        id: noteId,
        fragment: NOTE_FRAGMENT,
        data: updatedNote
      });
      return updatedNote;
    }
  }
};
