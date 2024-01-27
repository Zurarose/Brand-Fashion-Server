'use strict';
// @ts-ignore
const FSFilesAdapter = require('@parse/fs-files-adapter');
const path = require('path');

const filesAdapter = new FSFilesAdapter();
module.exports = {
  databaseURI: process.env.PARSE_SERVER_DATABASE_URI,
  appId: process.env.PARSE_SERVER_APPLICATION_ID,
  masterKey: process.env.PARSE_SERVER_MASTER_KEY,
  javascriptKey: process.env.PARSE_SERVER_JAVASCRIPT_KEY,
  port: process.env.PORT || 1337,
  mountPath: process.env.PARSE_SERVER_MOUNT_PATH || '/',
  allowHeaders: ['X-Apollo-Tracing'],
  cloud: process.env.PARSE_SERVER_CLOUD || path.resolve(__dirname, '../cloud-dist/index.js'),
  filesAdapter: filesAdapter,
  graphQLPath: process.env.PARSE_SERVER_GRAPHGQL_PATH,
  graphQLSchema: '/parse-server/schema.graphql',
  playgroundPath: process.env.PARSE_SERVER_GRAPHGQL_PLAYGROUND,
  logLevel: 'error',
  maxUploadSize: '500mb',
  mountGraphQL: true,
  mountPlayground: true, // remove in production
  directAccess: true,
  passwordPolicy: {
    doNotAllowUsername: true,
    resetTokenValidityDuration: 3 * 60 * 60,
  },
  allowClientClassCreation: false,
  allowExpiredAuthDataToken: false,
  protectedFields: {_User: {'*': ['email'], 'role:admin': []}},
  verbose: true,
  verifyUserEmails: false,
};
if (!process.env.PARSE_SERVER_IS_LOCAL_RUN) {
  module.exports.restAPIKey = process.env.PARSE_SERVER_REST_API_KEY;
}
