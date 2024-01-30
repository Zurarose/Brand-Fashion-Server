'use strict';

import Parse from 'parse/node';

const {PARSE_SERVER_APPLICATION_ID = '', PARSE_SERVER_MASTER_KEY, PARSE_SERVER_REST_API_KEY, PORT = 1337} = process.env;

console.log(PARSE_SERVER_APPLICATION_ID, PARSE_SERVER_MASTER_KEY, PARSE_SERVER_REST_API_KEY, PORT);

const PARSE_URL = `http://localhost:${PORT}/parse`; // 'http://localhost:1337/parse';

Parse.initialize(PARSE_SERVER_APPLICATION_ID, PARSE_SERVER_REST_API_KEY, PARSE_SERVER_MASTER_KEY);
(Parse as any).serverURL = PARSE_URL;
export default Parse;
