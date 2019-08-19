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
        type AuthData {
          userId: ID!,
          token: String!,
          tokenExpiration: String!
        }
        input AuthInput {
          username: String!
          password: String!
        }
        input UserInput {
          username: String!
          password: String!
          contact: String!
          email: String!
        }
        input UpdateUserInput {
          username: String,
          contact: String,
          email: String
        }
        type RootQuery {
            user(id: ID!): User!
            login(authInput: AuthInput): AuthData!
        }
        type RootMutation {
            createUser(userInput: UserInput): User
            updateUser(updateUserInput: UpdateUserInput): User
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);
