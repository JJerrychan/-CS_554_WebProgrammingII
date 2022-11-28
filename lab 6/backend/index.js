const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");
const { redisClient } = require("./config/redisConnetion");

const typeDefs = gql`
  #graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Pokemon {
    id: ID!
    name: String!
    image: String
    height: Int
    weight: Int
    types: [String]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getByPage(page: Int!): [Pokemon]
    getById(id: ID!): Pokemon
  }
`;
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    getById: async (_, args) => {
      try {
        let p = await redisClient.HGET("pokemon", args.id);
        if (p) return JSON.parse(p);
        const url = `https://pokeapi.co/api/v2/pokemon/${args.id}`;
        const { data } = await axios.get(url).catch((error) => {
          console.log(error.toJSON());
          return error;
        });
        const pokemon = {
          id: data.id,
          name: data.name,
          image: data.sprites.front_default,
          height: data.height,
          weight: data.weight,
          types: data.types.map((ele) => {
            return ele.type.name;
          }),
        };
        await redisClient.HSET("pokemon", pokemon.id, JSON.stringify(pokemon));
        return pokemon;
      } catch (e) {
        console.error(e);
        return e;
      }
    },

    getByPage: async (_, args) => {
      try {
        let p = await redisClient.HGET("page", `page${args.page}`);
        if (p) return JSON.parse(p);
        const offset = 20 * args.page;
        const url = `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${offset}`;
        const { data } = await axios.get(url);
        if (data.results.length === 0) throw "pagenum is out range";
        let pokemonList = [];
        data.results.forEach((ele) => {
          ele.url = ele.url.slice(0, -1);
          const id = ele.url.slice(
            ele.url.lastIndexOf("/") + 1,
            ele.url.length
          );
          const pokemon = {
            id: id,
            name: ele.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          };
          pokemonList.push(pokemon);
        });
        await redisClient.HSET(
          "page",
          `page${args.page}`,
          JSON.stringify(pokemonList)
        );
        return pokemonList;
      } catch (e) {
        console.error(e);
        return e;
      }
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
