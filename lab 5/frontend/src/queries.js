import { gql } from "@apollo/client";

const GET_IMAGES = gql`
  query UnsplashImages($pageNum: Int) {
    unsplashImages(pageNum: $pageNum) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const GET_BIN = gql`
  query BinnedImages {
    binnedImages {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const GET_POSTS = gql`
  query UserPostedImages {
    userPostedImages {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation UploadImage(
    $url: String!
    $description: String!
    $posterName: String!
  ) {
    uploadImage(url: $url, description: $description, posterName: $posterName) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const UPDATE_IMAGE = gql`
  mutation UpdateImage(
    $updateImageId: ID!
    $url: String
    $posterName: String
    $description: String
    $userPosted: Boolean
    $binned: Boolean
  ) {
    updateImage(
      id: $updateImageId
      url: $url
      posterName: $posterName
      description: $description
      userPosted: $userPosted
      binned: $binned
    ) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const DELETE_IMAGE = gql`
  mutation DeleteImage($deleteImageId: ID!) {
    deleteImage(id: $deleteImageId) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const exported = {
  GET_BIN,
  GET_IMAGES,
  GET_POSTS,
  UPDATE_IMAGE,
  UPLOAD_IMAGE,
  DELETE_IMAGE,
};

export default exported;
