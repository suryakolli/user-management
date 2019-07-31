require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const winston = require('winston');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const errors = require('./errors/index');
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
      createUser: (args) => User.findOne({ $or: [{ username: args.userInput.username }, { email: args.userInput.email }] })
        .then(user => {
          if (user) {
            throw errors.userAlreadyExists;
          }
          return bcrypt.hash(args.userInput.password, 12);
        })
        .then(hashedPassword => {
          const user = new User({
            username: args.userInput.username,
            password: hashedPassword,
            contact: args.userInput.contact,
            email: args.userInput.email,
            date: new Date(args.userInput.date),
          });
          return user.save();
        })
        .then(result => ({ ...result._doc, _id: result.id }))
        .catch(err => {
          throw err;
        }),
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
