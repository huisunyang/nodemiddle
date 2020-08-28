var express = require('express')
var {graphqlHTTP} = require('express-graphql')
var { buildSchema } = require('graphql')

var schema = buildSchema(`
  type Query {
    hello: String
  }
`)

var root = { hello: () => 'Hello world!' }

var app = express()
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphql: true,
}))
app.listen(8080, () => console.log('Now browse to localhost:8080/graphql'))