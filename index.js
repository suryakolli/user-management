const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            users: [String!]!
        }
        type RootMutation {
            createUser(name: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      users: () => ['User 1', 'User 2', 'User 3'],
      createUser: (args) => {
        const eventName = args.name;
        return eventName;
      },
    },
    graphiql: true,
  }),
);

app.listen(3000);
