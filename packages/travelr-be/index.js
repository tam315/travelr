const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

// DB setup

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'roott',
  password: process.env.TRAVELR_DB_DEV_PASS,
  database: 'travelr',
});

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
