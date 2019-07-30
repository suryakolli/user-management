require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const winston = require('winston');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-management' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

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
          email: String!
          date: String!
        }
        input UserInput {
          username: String!
          password: String!
          contact: String!
          email: String!
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
      users: () => (
        User.find()
          .then(users => users.map(user => ({ ...user._doc, _id: user.id })))
          .catch((err) => {
            throw err;
          })),
      createUser: (args) => {
        const user = new User({
          username: args.userInput.username,
          password: args.userInput.password,
          contact: args.userInput.contact,
          email: args.userInput.email,
          date: new Date(args.userInput.date),
        });
        return user.save()
          .then((result) => {
            logger.info('user created successfully');
            return { ...result._doc, _id: result.id };
          })
          .catch((err) => {
            logger.error(err);
            throw err;
          });
      },
    },
    graphiql: true,
  }),
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@gql-dnwof.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    logger.error(err);
  });
