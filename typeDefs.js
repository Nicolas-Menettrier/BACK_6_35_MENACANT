const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: Int!
    email: String!
    username: String!
    description: String
    all: Posts
    posts: Posts
    comments: Posts
    mode: Int!
    likes: Posts
    reposts: Posts
  }

  type Users {
    count: Int!
    users: [User]    
  }

  type Post {
    id: Int!
    message: String!
    user: User!
    post: Post
    comments: Posts
    mode: Int!
    likes: Users
    reposts: Users
    date: String!
  }

  type Posts {
    count: Int!
    posts: [Post]
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
    description(description: String!): User!
    post(message: String!, mode: Int, comments: Boolean): Post!
    removePost(id: Int!): Post!
    comment(postId: Int!, message: String!): Post!
    like(postId: Int!): Like!
    unlike(postId: Int!): Like!
    repost(postId: Int!): Like!
    unrepost(postId: Int!): Like!
    follow(userId: Int!): Follow!
    unfollow(userId: Int!): Follow!
  }

  type Query {
    user(id: Int): User!
    search(search: String!, size: Int): [User]!
    post(id: Int!): Post!
    posts(userId: Int): [Post]!
    all(userId: Int): [Post]!
    comment(id: Int!): Post!
    comments(userId: Int, postId: Int): [Post]!
    likes(userId: Int): [Post]!
    liked(postId: Int!): [User]!
    reposts(userId: Int): [Post]!
    reposted(postId: Int!): [User]!
    follows(userId: Int): [User]!
    followers(userId: Int): [User]!
  }
`;

module.exports = typeDefs;