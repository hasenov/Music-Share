import { gql } from '@apollo/client';

export const ADD_OR_REMOVE_FROM_QUEUE = gql`
  mutation addOrRemoveFromQueue($input: SongInput!) {
    addOrRemoveFromQueue(input: $input) @client
  }
`;

export const ADD_SONG = gql`
mutation addSong($title: String!, $artist: String!, $duration: Float!, $thumbnail: String!, $url: String!) {
  insert_music(objects: {title: $title, artist: $artist, duration: $duration, thumbnail: $thumbnail, url: $url}) {
    affected_rows
  }
}
`;