import gql from "graphql-tag";

export const GET_NOTES = gql`
  {
    notes @client {
      id
      title
      content
    }
  }
`;

export const GET_SIMULATION = gql`
  {
    simulation @client {
      startDate
      endDate
    }
  }
`;
