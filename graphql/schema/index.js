const { buildSchema } = require('graphql');

module.exports = buildSchema(`
        type User {
          _id: ID!
          username: String!
          password: String!
          contact: String!
          email: String!
          createdAt: String!
          updatedAt: String!
        }
        input UserInput {
          username: String!
          password: String!
          contact: String!
          email: String!
        }
        type RootQuery {
            user(id: String!): User!
        }
        type RootMutation {
            createUser(userInput: UserInput): User
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);
