const fs = require('fs');
const http = require('http');
const cors = require('cors');
const gql = require('graphql-tag');
const express = require('express');
const config = require('./config/server');
const compression = require('compression')
const {default: ParseServer, ParseGraphQLServer} = require('parse-server');

const parseServer = new ParseServer(config);
const {graphQLPath, playgroundPath, graphQLSchema, mountPath, port} = config;

const customSchema = fs.existsSync(graphQLSchema) ? fs.readFileSync(graphQLSchema) : '';
const graphCustom = customSchema.toString('utf8').trim()
  ? {
      graphQLCustomTypeDefs: gql`
        ${customSchema}
      `,
    }
  : {};
const parseGraphQLServer = new ParseGraphQLServer(parseServer, {
  graphQLPath,
  playgroundPath,
  ...graphCustom,
});

const originsWhitelist = [process.env.SITE_URL, process.env.ADMIN_SITE_URL, process.env.PARSE_PUBLIC_SERVER_URL];

const corsOptions = {
  origin: function (origin, callback) {
    const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true,
};

const app = express();
parseGraphQLServer.applyGraphQL(app);
//(Optional) Mounts the GraphQL Playground - do NOT use in Production
parseGraphQLServer.applyPlayground(app);
parseServer.start();
app.set('trust proxy', true);
app.use(cors(corsOptions));
app.use(compression())
app.options('*', cors(corsOptions));
app.use(mountPath, parseServer.app);

app.use(function (req, res, next) {
  // Set Cache-Control headers
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // Example: Cache for 1 hour
  next();
});
const httpServer = http.createServer(app);
httpServer.listen(port, async () => {
  console.log('<<<<<<<<< CONFIG >>>>>>>>');
  console.log(config);
});
