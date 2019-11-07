import 'dotenv/config'
import express from 'express'
import {ApolloServer, AuthorizationError, AuthenticationError} from 'apollo-server-express'
import cors from 'cors'
import schema from './schema'
import resolvers from './resolvers'
import models, { sequelize} from './models'
import jwt from 'jsonwebtoken'
import http from 'http'
import DataLoader from 'dataloader'
import loaders from './loaders'

const app = express()
app.use(cors())

// validate the token from the request header
// use this to define or undefined me in context obj
const getMe = async req => {
    const token = req.headers['x-token'];
  
    if (token) {
      try {
        return await jwt.verify(token, process.env.SECRET);
      } catch (e) {
        throw new AuthenticationError(
          'Your session expired. Sign in again.',
        );
      }
    }
  };


// move dataloader out from context, so it turns on DataLoader cache
const userLoader = new DataLoader(keys => loaders.user.batchUsers(keys, models))

//me: models.users[1], should no longer work
// and I don't think I need it
//me: models.User.findByLogin('kieu1') this will't work
const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError: error => {
        // remove the internal sequelize error message
        // leave only the important validation error
        const message = error.message
            .replace('SequelizeValidationError: ', '')
            .replace('Validation error: ', '')
        return { ...error, message}
    },
    context: async ({req, connection}) => {
        // subscription you get connection obj
        if (connection) {
            return { models}
        }
        // for query and mutation, you get req and res objs
        // every request => a new DataLoader instant with new set of keys
        if (req) {
            const me = await getMe(req);
            return {
                models,
                me,
                secret: process.env.SECRET,
                loaders: { 
                  user: userLoader,
                }
            }
        }
    }
})
// bring in express middleware into apolloServer
// also specify GQL end point
server.applyMiddleware({app, path: '/graphql'})

const httpServer = http.createServer(app);
// Apollo server has subscription handler ??
server.installSubscriptionHandlers(httpServer)

const isTest = !!process.env.TEST_DATABASE;
sequelize.sync({ force: isTest }).then(async () => {
    if (isTest) {
        createUsersWithMessages(new Date())
    }
    httpServer.listen({port: 8000}, () => {
        console.log('Apollo Server on http://localhost:8000/graphql')
    })
})

const createUsersWithMessages = async date => {
    await models.User.create(
      { username: 'kieu1',
        email: 'kieu1@example.com',
        password: 'abcd1234',
        role: 'ADMIN',
        messages: [{text: 'Hello one from kieu',
                createdAt: date.setSeconds(date.getSeconds() + 1)},
        ],
      },
      { include: [models.Message], },
    );
  
    await models.User.create(
      { username: 'morgan1',
        email: 'morgan1@example.com',
        password: 'abcd1234',
        role: 'USER',
        messages: [
          { text: 'Hello one from morgan1',
            createdAt: date.setSeconds(date.getSeconds() + 1)},
          {text: 'Hello two from morgan1', 
            createdAt: date.setSeconds(date.getSeconds() + 1)},
        ],
      },
      {
        include: [models.Message],
      },
    );
    await models.User.create(
        { username: 'morgan2',
          email: 'morgan2@example.com',
          password: 'abcd1234',
          role: 'USER',
          messages: [
            { text: 'Hello one from morgan2',
              createdAt: date.setSeconds(date.getSeconds() + 1)},
            {text: 'Hello two from morgan2',
              createdAt: date.setSeconds(date.getSeconds() + 1)},
            { text: 'Hello 3 from morgan2',
              createdAt: date.setSeconds(date.getSeconds() + 1)},
            {text: 'Hello 4 from morgan2',
              createdAt: date.setSeconds(date.getSeconds() + 1)},
            { text: 'Hello 5 from morgan2',
              createdAt: date.setSeconds(date.getSeconds() + 1)},
            {text: 'Hello 6 from morgan2',
              createdAt: date.setSeconds(date.getSeconds() + 1)},
            { text: 'Hello 7 from morgan2',
              createdAt: date.setSeconds(date.getSeconds() + 1)},
            {text: 'Hello 8 from morgan2',
              createdAt: date.setSeconds(date.getSeconds() + 1)},
            {text: 'Hello 9 from morgan2',
              createdAt: date.setSeconds(date.getSeconds() + 1)},
            {text: 'Hello 10 from morgan2',
              createdAt: date.setSeconds(date.getSeconds() + 1)},
            {text: 'Hello 11 from morgan2',
              createdAt: date.setSeconds(date.getSeconds() + 1)},
            {text: 'Hello 12 from morgan2',
              createdAt: date.setSeconds(date.getSeconds() + 1)},
          ],
        },
        {
          include: [models.Message],
        },
      );
  };
  
