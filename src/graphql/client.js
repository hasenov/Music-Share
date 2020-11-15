import { ApolloClient, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { gql } from '@apollo/client';
import { GET_QUEUED_SONGS } from './queries';

const client = new ApolloClient({
  link: new WebSocketLink({
    uri: `wss://music.hasura.app/v1/graphql`,
    options: {
      reconnect: true
    },
  }),
  cache: new InMemoryCache(),
  typeDefs: gql`
    type Song {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      url: String!
      duration: Float!
    }

    input SongInput {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      url: String!
      duration: Float!
    }

    type Query {
      queuedSongs: [Song]!
    }

    type Mutation {
      addOrRemoveFromQueue(input: SongInput!): [Song]!
    }
  `,
  resolvers: {
    Mutation: {
      addOrRemoveFromQueue: (_, { input }, { cache }) => {
        const queryResult = cache.readQuery({
          query: GET_QUEUED_SONGS
        });
        if (queryResult) {
          const { queuedSongs } = queryResult;
          const isInQueue = queuedSongs.some(song => song.id === input.id);
          const newQueue = isInQueue
            ? queuedSongs.filter(song => song.id !== input.id)
            : [...queuedSongs, input];
          cache.writeQuery({
            query: GET_QUEUED_SONGS,
            data: { queuedSongs: newQueue }
          });
          return newQueue;
        }
        return [];
      }
    }
  }
});

const hasQueue = Boolean(localStorage.getItem('queuedSongs'));

const data = {
  queuedSongs: hasQueue ? JSON.parse(localStorage.getItem('queuedSongs')) : []
}

client.writeQuery({ query: GET_QUEUED_SONGS, data });

export default client;