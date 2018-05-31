const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// DB setup
mongoose.connect(
  'mongodb://admin:Uq6D4mPT@ds016298.mlab.com:16298/react-advanced-serverside',
);

// middlewares
app.use(morgan('combined')); // logs accesses
app.use(bodyParser.json({ type: '*/*' })); // parses any requests into json
app.use(cors());

// Routes
const router = require('./router');
router(app);

// start server
const port = 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);
