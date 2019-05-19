import gql from "graphql-tag";

export const NOTE_FRAGMENT = gql`
  fragment NotePars on Note {
    id
    title
    content
  }
`;

export const SIMULATION_FRAGMENT = gql`
  fragment SimulationParts on Simulation {
    startDate
    endDate
  }
`;