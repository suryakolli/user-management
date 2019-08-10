require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const winston = require('winston');
const mongoose = require('mongoose');
const gqlSchema = require('./graphql/schema');
const gqlResolvers = require('./graphql/resolvers');
const authenticate = require('./middleware/authenticate');

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

app.use(authenticate);

app.use(
  '/graphql',
  graphqlHttp({
    schema: gqlSchema,
    rootValue: gqlResolvers,
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
