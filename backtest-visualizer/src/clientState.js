import { NOTE_FRAGMENT, SIMULATION_FRAGMENT } from "./fragments";
import { GET_NOTES } from "./queries";

export const defaults = {
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
