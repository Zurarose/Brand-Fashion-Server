'use strict';

import Parse from 'parse/node';

const {
  PARSE_SERVER_APPLICATION_ID = '',
  PARSE_SERVER_MASTER_KEY,
  PARSE_SERVER_JAVASCRIPT_KEY,
  PORT = 1337,
  PARSE_SERVER_MOUNT_PATH = '/parse',
} = process.env;

const PARSE_URL = `http://localhost:${PORT}${PARSE_SERVER_MOUNT_PATH}`; // 'http://localhost:1337/parse';

Parse.initialize(PARSE_SERVER_APPLICATION_ID, PARSE_SERVER_JAVASCRIPT_KEY, PARSE_SERVER_MASTER_KEY);
(Parse as any).serverURL = PARSE_URL;
export default Parse;
