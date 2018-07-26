const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const http = require('http');
const morgan = require('morgan');

const router = require('./router');

// start server
const app = express();

// middlewares
if (process.env.NODE_ENV !== 'test') {
  // log access unless it is a test environment
  app.use(morgan('combined'));
}
app.use(bodyParser.json({ type: '*/*' })); // parses any requests into json
app.use(cors());
app.use(compression());

// Routes
router(app);

const port = 3090;
const server = http.createServer(app);

// Run the server unless it is a test environment
if (process.env.NODE_ENV !== 'test') {
  server.listen(port);
  // eslint-disable-next-line
  console.log('Server listening on: ', port);
}

// For testing
module.exports = app;
