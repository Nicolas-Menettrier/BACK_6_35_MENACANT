const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: Int!
    email: String!
    username: String!
    posts: [Post]
    comments: [Post]
    mode: Int!
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
    id: Int!
    user: User!
    post: Post!
  }

  type Follow {
    id: Int!
    follower: User!
    followed: User!
  }

  type Mutation {
    mode: User!
    post(message: String!, mode: Int, comments: Boolean): Post!
    comment(postId: Int!, message: String!): Post!
    like(postId: Int!): Like!
    unlike(postId: Int!): Like!
    follow(userId: Int!): Follow!
    unfollow(userId: Int!): Follow!
  }

  type Query {
    user(id: Int): User!
    post(id: Int!): Post!
    posts(userId: Int): [Post]!
    all(userId: Int): [Post]!
    comment(id: Int!): Post!
    comments(userId: Int, postId: Int): [Post]!
    likes(userId: Int): [Post]!
    liked(postId: Int): [User]!
    follows(userId: Int): [User]!
    followers(userId: Int): [User]!
  }
`;

module.exports = typeDefs;