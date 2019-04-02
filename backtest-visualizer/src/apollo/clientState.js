import { defaultsState } from "./defaultsState";

export const defaults = defaultsState;

export const typeDefs = `
    schema {
        query: Query
        mutation: Mutation
    }
    type Query {
        notes: [Note]!
        note(id: Int!): Note
        simulation: Simulation
        globalVariables: GlobalVariables
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

    GlobalVariables{
        startDate: String
        endDate: String
        codeList: [String]
        selectedAllocation: []
    }

    correlationPage: {
        one: String,
        another: String,
        rolling: Int,
        baseDate: String
    }

    assetAllocationPage: {
        weightLimit: Object
    }

    `;
