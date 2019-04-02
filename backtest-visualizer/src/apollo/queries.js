import gql from "graphql-tag";

export const GET_GLOBAL_VARIABLES = gql`
  {
    globalVariables @client {
      startDate
      endDate
      codeList
      selectedCode
      selectedAllocation
    }
  }
`;

export const GET_COR_PAGE = gql`
  {
    correlationPage @client {
      one
      another
      rolling
      baseDate
    }
  }
`;

export const GET_ASSET_ALO_PAGE = gql`
  {
    assetAllocationPage @client {
      weightLimit
    }
  }
`;

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

export const GET_PRICE_LIST = gql`
  {
    priceList @client {
      code
      closePrice
    }
  }
`;
