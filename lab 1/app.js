const express = require('express');
const app = express();
const configRoutes = require('./routes');
const session = require('express-session');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/', (req, res, next) => {
  const currentTime = new Date().toUTCString();
  const method = req.method;
  const route = req.originalUrl;
  const status = req.session.AuthCookie
    ? 'Authenticated User'
    : 'Non-Authenticated User';
  console.log(`[${currentTime}]: ${method} ${route} (${status})`);
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
