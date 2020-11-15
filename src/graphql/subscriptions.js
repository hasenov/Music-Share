import { gql } from '@apollo/client'

export const GET_SONGS = gql`
subscription getSongs {
  music(order_by: {created_at: desc}) {
    artist
    created_at
    duration
    id
    thumbnail
    title
    url
  }
}
`;