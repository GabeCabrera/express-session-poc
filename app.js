const express = require('express');
const session = require('express-session');
const sha1 = require('sha1');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.urlencoded({extended: true}));

const users = [
  { id: 1, name:'user', email: 'user@fakedomain.com', password: 'password' }
];

const {
  PORT = 3000,
  SESS_NAME = 'sid',
  SESS_SECRET = 'secret'
} = process.env

app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET
}));

const handleUnauthenticatedState = (req, res, next) => {
  if(!req.session.userId) {
    res.send('Please log in.');
  } else {
    next();
  };
};

const handleAuthenticatedState = (req, res, next) => {
  if(req.session.userId) {
    res.send('You are logged in.')
  } else {
    next()
  };
};

let serverToken = '';
let userId = '';
const saltRounds = 10;

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const access_token = sha1(req.session.id + Date.now());
  
  if (email && password) { // TODO: validation, length of email and length and strength of password
    const user = users.find(
      user => user.email === email && bcrypt.compare(password, user.password) // TODO: compare password with hash.
    )
    if (user) {
      serverToken = access_token;
      userId = user.id;
      return res.send(access_token);
    }
  }
  res.send('Unsuccessful login');
});

app.get('/profile', (req, res) => {
  const isActiveSession = () => {
    return serverToken === req.headers.access_token;
  };
  if (isActiveSession()) {
    const user = users.find(
      user => user.id === userId // TODO: compare password with hash.
    );
    res.send(user);
  } else {
    res.send('unauthorized.')
  }
});

app.post('/register', handleAuthenticatedState, (req, res) => {
  let { name, email, password } = req.body

  if (name && email && password) { // TODO: validation, length of email and length and strength of password
    const exists = users.some(
      user => user.email === email
    );

    if (!exists) {

      const user = {
        id: users.length + 1,
        name,
        email,
        password
      };

        user.password = req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
        console.log(JSON.stringify(user));
        req.session.userId  = user.id;
        return res.send('/home');
    }
  }
  res.send('Error registering user'); // TODO: QueryString errors /register?error=error.auth.userExists
});

app.post('/logout', handleUnauthenticatedState, (req, res) => {
  req.session.destroy()
});

app.listen(PORT, () => console.log(
  `http://localhost:${PORT}`
));


 