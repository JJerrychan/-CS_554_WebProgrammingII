const { ApolloServer, gql } = require("apollo-server");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const apiKeys = require("./config/apiKeys");
const { redisClient } = require("./config/redisConnetion");

const typeDefs = gql`
  #graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    unsplashImages(pageNum: Int): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
  }

  type Mutation {
    uploadImage(
      url: String!
      description: String!
      posterName: String!
    ): ImagePost
    updateImage(
      id: ID!
      url: String
      posterName: String
      description: String
      userPosted: Boolean
      binned: Boolean
    ): ImagePost
    deleteImage(id: ID!): ImagePost
  }
`;
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    unsplashImages: async (_, args) => {
      let imagesList = [];
      try {
        const { data } = await axios.get(
          `https://api.unsplash.com/photos/?client_id=${apiKeys.unsplashKeys.accessKey}&page=${args.pageNum}`
        );
        data.forEach((element) => {
          imagePost = {
            id: element.id,
            url: element.urls.small,
            posterName: element.user.username,
            description: element.description,
            userPosted: false,
            binned: false,
          };
          imagesList.push(imagePost);
        });
        return imagesList;
      } catch (e) {
        console.error(e);
        return e;
      }
    },
    binnedImages: async () => {
      const data = await redisClient.HGETALL("posts");
      const postData = Object.values(data)
        .map((ele) => JSON.parse(ele))
        .filter((ele) => ele.binned === true);
      return postData;
    },
    userPostedImages: async () => {
      const data = await redisClient.HGETALL("posts");
      const postData = Object.values(data)
        .map((ele) => JSON.parse(ele))
        .filter((ele) => ele.userPosted === true);
      return postData;
    },
  },
  Mutation: {
    uploadImage: async (_, args) => {
      args.id = uuidv4();
      args.binned = false;
      args.userPosted = true;
      await redisClient.HSET("posts", args.id, JSON.stringify(args));
      let data = await redisClient.HGET("posts", args.id);
      return JSON.parse(data);
    },
    updateImage: async (_, args) => {
      args.description = args.description ? args.description : "";
      await redisClient.HSET("posts", args.id, JSON.stringify(args));
      let data = await redisClient.HGET("posts", args.id);
      data = JSON.parse(data);
      if (!data.binned && !data.userPosted)
        await redisClient.HDEL("posts", args.id);
      return data;
    },
    deleteImage: async (_, args) => {
      const data = await redisClient.HGET("posts", args.id);
      await redisClient.HDEL("posts", args.id);
      return JSON.parse(data);
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
