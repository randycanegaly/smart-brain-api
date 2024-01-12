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
  

// select returns a promise - it is asynchronous  
//db.select().table('users').then(data => console.log(data));

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {res.send('route not used')});
app.post('/signin', (req, res) => {signin.handleSignIn(req, res, db, bcrypt)}); //TO DO - investigate the signin.handleSignIn(db, bcrypt) version of this - how work?
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)});
app.put('/image', (req, res) => {image.handleImage(req, res, db)});

app.listen(3000, () => {
    console.log('smart-brain-api is running on port 3000');
});