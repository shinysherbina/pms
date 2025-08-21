import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql/", // adjust if needed
  cache: new InMemoryCache(),
});

export default client;
