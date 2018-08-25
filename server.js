const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Crawler = require('./server/track-crawler');
const User = require('./models/User');

const url = 'mongodb://localhost:27017/learning';
const options = {
  keepAlive: 300000,
  connectTimeoutMS: 30000
};

const app = express();
const port = process.env.PORT || 5000;
mongoose.connect(url, options);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('DB Connected');
});

app.use(
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  }
);

app.use(bodyParser.json());

app.get('/api/:year', (req, res) => {
  Crawler.getMeets(req.params.year, (meets) => {
    res.send(meets);
  });
});

app.get('/api/getToken/:info', (req, res) => {
  jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    data: req.params.info
  }, 'shhhhhhhhh', (err, token) => {
    if (err) {
      res.send('an Error Occured');
    } else {
      res.send(token);
    }
  });
});

app.post('/api/verify/', (req, res) => {
  jwt.verify(req.body.token, 'shhhhhhhhh', (err, decoded) => {
    if (err) {
      res.send({
        status: 'Token validation failed: Token is bad.',
        err: {
          code: 401,
          body: err
        },
        timestamp: Date.now()
      });
    } else {
      res.send({
        status: 'Token Valid.',
        valid: true,
        decoded
      });
    }
  });
});

app.post('/api/meetDetails/', (req, res) => {
  Crawler.getMeetDetails(req.body, (meet) => {
    res.send(meet);
  });
});

app.post('/api/createUser', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.send({
        status: 'Sign up failed: server error.',
        err: {
          code: 500,
          body: err
        },
        timestamp: Date.now()
      });
    }
    const testData = new User({
      username: req.body.username,
      password: hash,
    });
    testData.save((dataerr, data) => {
      if (dataerr) {
        console.log(dataerr);
        res.send({
          status: 'Sign up failed: server error.',
          err: {
            code: 500,
            body: dataerr
          }
        });
      } else {
        res.send({
          status: 'Sign up success.'

        });
      }
    });
  });
});

app.post('/api/login', (req, res) => {
  const login = req.body;
  User.findOne({
    username: login.username
  }, (err, data) => {
    if (err || !data) {
      res.send({
        status: `Login Failed: Error finding user with the username: ${login.username}.`,
        err: {
          code: 400,
          body: err
        },
        request_timestamp: Date.now()
      });
    } else {
      bcrypt.compare(login.password, data.password, (loginErr, resolution) => {
        if (loginErr) {
          res.send({
            status: 'Login Failed: Server error, failed to authenticate user.',
            err: {
              code: 500,
              body: loginErr
            }
          });
        } else {
          if (resolution) {
            jwt.sign({
              username: login.username,
              request_timestamp: Date.now()
            }, 'shhhhhhhhh', {
              expiresIn: '2 days'
            }, (signerr, token) => {
              if (signerr) {
                res.send({
                  status: 'Login Failed: Error occured when granting a token',
                  err: {
                    code: 500,
                    body: signerr
                  },
                  request_timestamp: Date.now()
                });
              } else {
                res.send({
                  status: 'Login Success.',
                  token,
                  exp: 2,
                  request_timestamp: Date.now()
                });
              }
            });
          } else {
            res.send({
              status: 'Login Failed: No such username password combination',
              err: {
                code: 401,
                body: {
                  message: 'Authentication failed, password error'
                }
              },
              request_timestamp: Date.now()
            });
          }
          // res.send(resolution ? 'Login Success' : 'Wrong Password');
        }
      });
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));