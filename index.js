const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const users = [];

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
        type User {
          _id: ID!
          username: String!
          password: String!
          contact: String!
          date: String!
        }
        input UserInput {
          username: String!
          password: String!
          contact: String!
          date: String!
        }
        type RootQuery {
            users: [User!]!
        }
        type RootMutation {
            createUser(userInput: UserInput): User
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      users: () => users,
      createUser: (args) => {
        const user = {
          _id: Math.random().toString(),
          username: args.userInput.username,
          password: args.userInput.password,
          contact: args.userInput.contact,
          date: args.userInput.date,
        };
        users.push(user);
        return user;
      },
    },
    graphiql: true,
  }),
);

app.listen(3000);
