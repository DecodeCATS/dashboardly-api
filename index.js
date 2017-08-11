const express = require('express');
const cors = require('express-cors');
const mysql = require('promise-mysql');

// Express middleware
const bodyParser = require('body-parser');
const morgan = require('morgan');
//const cookieParser = require('cookie-parser');
const checkLoginToken = require('./lib/check-login-token.js');

// Data loader
const DashboardlyDataLoader = require('./lib/dashboardly.js');

// Controllers
const authController = require('./controllers/auth.js');
const boardsController = require('./controllers/boards.js');
const bookmarksController = require('./controllers/bookmarks.js');


// Database / data loader initialization
const connection = mysql.createPool({
  // host: 'localhost',
  // user: 'root',
  // password: 'Admin123.',
  // database: 'dashboardly'
  host: 'us-cdbr-iron-east-05.cleardb.net',
  user:'b3a63404c9a653',
  password: 'a59df5fe',
  database: 'heroku_c6d0f28fce12df4'

});
const dataLoader = new DashboardlyDataLoader(connection);


// Express initialization
const app = express();

// Every time server sends a response, server allows access control in the headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, authorization");
  next();
});


app.use(cors({
/*  allowedOrigins: [
    'https://80c06665.ngrok.io', 'http://localhost:3000', 'http://decodemtl-ct-tsirrus.c9users.io:8080', '*'
  ],*/

}));
app.use(morgan('dev'));
app.use(bodyParser.json());
//app.use(cookieParser);
app.use(checkLoginToken(dataLoader));


app.use('/auth', authController(dataLoader));
app.use('/boards', boardsController(dataLoader));
app.use('/bookmarks', bookmarksController(dataLoader));


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  if (process.env.C9_HOSTNAME) {
    console.log(`Web server is listening on https://${process.env.C9_HOSTNAME}`);
  } else {
    console.log(`Web server is listening on http://localhost:${port}`);
  }
});
