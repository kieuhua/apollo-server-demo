import 'dotenv/config'
import express from 'express'
import {ApolloServer, AuthorizationError, AuthenticationError} from 'apollo-server-express'
import cors from 'cors'
import schema from './schema'
import resolvers from './resolvers'
import models, { sequelize} from './models'
import jwt from 'jsonwebtoken'

const app = express()
app.use(cors())

// validate the token from the request header
// use this to define or undefined me in context obj
const getMe = async req => {
    const token = req.headers['x-token'];
    if (token) {
        try {
            return await jwt.verify(token, process.env.SECRET)
        } catch (e) {
            throw new AuthenticationError('Your session expired. Sign in again.')
        }
    }
}

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
    context: async () => {
        return {
        models,
        me: await models.User.findByLogin('kieu1'),
        secret: process.env.SECRET,
        }
    }
})
// bring in express middleware into apolloServer
// also specify GQL end point
server.applyMiddleware({app, path: '/graphql'})

const eraseDatabaseOnSync = true;
// migrated/sychronize the DB
sequelize.sync({force: eraseDatabaseOnSync}).then( async () => {
    if (eraseDatabaseOnSync) {
        createUsersWithMessages();
    }
    app.listen({port: 8000}, () => {
        console.log('Apollo Server on http://localhost:8000/graphql')
    })
})

const createUsersWithMessages = async () => {
    await models.User.create(
      { username: 'kieu1',
        email: 'kieu1@example.com',
        password: 'abcd1234',
        messages: [
          {text: 'Hello one from kieu',},
        ],
      },
      { include: [models.Message], },
    );
  
    await models.User.create(
      { username: 'morgan1',
        email: 'morgan1@example.com',
        password: 'abcd1234',
        messages: [
          { text: 'Hello one from morgan1',},
          {text: 'Hello two from morgan1',},
        ],
      },
      {
        include: [models.Message],
      },
    );
  };
  
