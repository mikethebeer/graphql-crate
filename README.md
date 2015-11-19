# graphql-crate
This repo demonstrates how a [GraphQL][1] middleware server can be used to run 
queries against [Crate DB][2].

## Setup and prerequisites
This project uses [buildout][3] to manage its dependencies. The only thing you 
need is a working `python >= 2.7` installed.

```bash
python bootstrap.py
bin/buildout -N
bin/npm install
```

If you haven't used `buildout` and installed `npm` globally you can simply run:
```bash
npm install
```
[npm][4] is going to install you the required dependencies for running the 
GraphQL middleware server. These packages are listed below:
  * [graphql](https://github.com/graphql/graphql-js), the reference 
    implementation of GraphQL in JS
  * [express](https://github.com/strongloop/express), a minimalist web framework
  * [express-graphql](https://github.com/graphql/express-graphql), the HTTP 
    server for exposing GraphQL
  * [crate-js](https://github.com/herenow/cratejs), a node.js driver for 
    [Crate][2]
  * [q](https://github.com/kriskowal/q), the promise library for node

## Run
If your environment setup is successful the middleware can be started:

```bash
bin/node index.js
```
This will start the GraphQL server and the HTTP endpoint is set to 
http://localhost:3000/graphql. If you open this URL in a browser you are able to 
run GraphQL-queries with the interactive in-browser [Graphiql][5] IDE.

[1]: http://graphql.org/
[2]: https://crate.io
[3]: http://www.buildout.org/en/latest/
[4]: https://www.npmjs.com/
[5]: https://github.com/graphql/graphiql
