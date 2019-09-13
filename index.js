const { ApolloServer, gql } = require('apollo-server');
const _ = require('lodash');


// A schema is a collection of type definitions (hence "typeDefs") 
// that together define the "shape" of queries that are executed against 
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type Author {
    name: String
    age: Int
    books: [Book]
    id: Int
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    authors: [Author]
    author(id: Int): Author
  }
`;

const books = [
    {
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
    },
    {
      title: 'Jurassic Park',
      author: 'Michael Crichton',
    },
  ];

const authors = [
  {
    name: 'J.K. Rowling',
    age: 50,
    id: 1
  },
  {
    name: 'Michael Crichton',
    age: 70,
    id: 2,
  }
];

const resolvers = {
   Query: {
     books: () => books,
     authors: () => authors,
     author: (parent, args, context, info) => _.find(authors, { id: args.id })
   },
   Author: {
     books: (author) => _.filter(books, { author: author.name })
   }
};

const server = new ApolloServer({ typeDefs, resolvers });

  // The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});