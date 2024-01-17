const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

//console.log('register:', register, 'signin:', signin, 'image', image, 'profile', profile);

const db = knex({ //I think this returns an instance of a knex object ??? TO DO - check knex docs
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'randytwo',
      password : '',
      database : 'smart-brain'
    }
  });

//console.log('db:', db.select);
  

// select returns a promise - it is asynchronous  
//db.select().table('users').then(data => console.log(data));

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {res.send('route not used')})
/*
post() takes a route string and a callback function - callback takes db and bcrypt
handleSignIn is the callback function, the ExpressJS code uses that callback
when Express uses the handleSignIn callback function, that callback returns another function that takes (req, res)
Express uses that function, passing it req and res
that function pulls the email and password out of req, and via hashing, checks the login table for that password
if there is a matching hash of password in the login table
return the user information for the matching user in the users table
*/
app.post('/signin', signin.handleSignIn(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfile(db))
app.put('/image', image.handleImage())
app.put('/entries', image.handleEntriesUpdate(db))
//app.post('/imageurl', image.handleImageApiCall())
//create a new endpoint that returns 

app.listen(3000, () => {
    console.log('smart-brain-api is running on port 3000');
});