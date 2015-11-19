var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');
var Crate = require('cratejs');
var q = require('q');

// define the HTTP endpoint of the GraphQL middleware
var db = module.exports = new Crate({
  host: 'localhost',
  port: 4200
});

var executeSql = function (stmt) {
  var deferred = q.defer();
  var query_limit = 10;
  db.execute(stmt, [query_limit], function (err, res) {
    deferred.resolve(res);
  });
  return deferred.promise;
};

/**********************************************
*************** GraphQL Schema ****************
***********************************************/

var actorType = new graphql.GraphQLObjectType({
  name: 'Actor',
  fields: {
    id: { type: graphql.GraphQLString },
    avatar_url: { type: graphql.GraphQLString },
    login: { type: graphql.GraphQLString },
    gravatar_id: { type: graphql.GraphQLString },
    url : { type: graphql.GraphQLString }
  }
});

var repoType = new graphql.GraphQLObjectType({
  name: 'Repo',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    url: { type: graphql.GraphQLString }
  }
});

var schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      actor: {
        type: actorType,
        args: {
          id: { type: graphql.GraphQLString }
        },
        resolve: function (_, args) {
          var res = executeSql("select actor from github where id='" + args.id + "' limit ?");
          return res.then(function(data) {
            var mydata = data['rows'][0][0];
            console.log(mydata);
            return mydata;
          });
        }
      },
      repo: {
        type: repoType,
        args: {
          name: { type: graphql.GraphQLString },
          id: { type: graphql.GraphQLString }
        },
        resolve: function (_, args) {
          if (args.id != null && args.name != null) {
            var res = executeSql("select repo from github where repo['id']='" + args.id + "' and repo['name']='" + args.name + "' limit ?");
          } else if (args.id != null && args.name == null) {
            var res = executeSql("select repo from github where repo['id']='" + args.id + "' limit ?");
          } else if (args.id == null && args.name != null) {
            var res = executeSql("select repo from github where repo['name']='" + args.name + "' limit ?");
          } else {
            var res = executeSql("select repo from github limit ?");
          }
          return res.then(function(data) {
            var mydata = data['rows'][0][0];
            console.log(mydata);
            return mydata;
          });
        }
      }
    }
  })
});

console.log('Started on http://localhost:3000/graphql');
var app = express()
app.use('/graphql', graphqlHTTP({ schema: schema, retty: true, graphiql: true }));
app.listen(3000);
