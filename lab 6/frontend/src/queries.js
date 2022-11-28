import { gql } from "@apollo/client";

const GET_BY_PAGE = gql`
  query GetByPage($page: Int!) {
    getByPage(page: $page) {
      id
      image
      name
    }
  }
`;

const GET_BY_ID = gql`
  query GetById($id: ID!) {
    getById(id: $id) {
      id
      name
      image
      height
      weight
      types
    }
  }
`;

const exported = {
  GET_BY_ID,
  GET_BY_PAGE,
};

export default exported;
