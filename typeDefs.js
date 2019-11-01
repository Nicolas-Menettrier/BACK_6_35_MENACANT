const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: Int!
    email: String!
    username: String!
    posts: [Post]
    comments: [Post]
  }

  type Post {
    id: Int!
    message: String!
    user: User!
    post: Post
    comments: [Post]
    mode: Int!
  }

  type Like {
    id: Int
    user: User
    post: Post
  }

  type Mutation {
    post(message: String!, mode: Int, comments: Boolean): Post!
    comment(postId: Int!, message: String!, mode: Int, comments: Boolean): Post!
    like(postId: Int!): Like!
    unlike(postId: Int!): Like!
  }

  type Query {
    user(id: Int): User!
    post(id: Int!): Post!
    posts(userId: Int): [Post]!
    comment(id: Int!): Post!
    comments(userId: Int, postId: Int): [Post]!
    likes(userId: Int): [Post]!
    liked(postId: Int): [User]!
  }
`;

module.exports = typeDefs;