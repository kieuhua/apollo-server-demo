import 'dotenv/config'
import express from 'express'
import {ApolloServer, gql } from 'apollo-server-express'
import cors from 'cors'
import schema from './schema'
import resolvers from './resolvers'
import models from './models'

const app = express()
app.use(cors())

// ! mean non-null or no undefined
// convertion query type is Query, but it can be anything like KieuQuery 
// but needs schema if you have somthing diff
// if you use Query then you don't need define schema line
// String! means is require non-null, no undefined
// so username is always return a string
// me can be null

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        models,
        me: models.users[1],
    }
})
// bring in express middleware into apolloServer
// also specify GQL end point
server.applyMiddleware({app, path: '/graphql'})

// still use express listen for incoming requests
app.listen({port: 8000}, () => {
    console.log('Apollo Server on http://localhost:8000/graphql')
})

