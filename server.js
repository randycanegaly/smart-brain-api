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
    // connection: {
    //   host : '127.0.0.1',
    //   port : 5432,
    //   user : 'randytwo',
    //   password : '',
    //   database : 'smart-brain'
    // }
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false},
      host : process.env.DATABASE_HOST,
      port : 5432,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PW,
      database : process.env.DATABASE_DB
    }//,
    // pool: {
    //   afterCreate: function (conn, done) {
    //     console.log("got to here, before first query");
    //     // in this example we use pg driver's connection API
    //     conn.query('SET timezone="UTC";', function (err) {
    //       if (err) {
    //         console.log(err);
    //         // first query failed, 
    //         // return error and don't try to make next query
    //         done(err, conn);
    //       } else {
    //         // do the second query...
    //         console.log("got to here, before second query");
    //         conn.query(
    //           'SELECT set_limit(0.01);', 
    //           function (err) {
    //             // if err is not falsy, 
    //             //  connection is discarded from pool
    //             // if connection aquire was triggered by a 
    //             // query the error is passed to query promise
    //             console.log(err);
    //             done(err, conn);
    //           });
    //       }
    //     });
    //     console.log("at end of afterCreate");
    //   }
    // }

  });

// console.log('db:', db.select);
  

// select returns a promise - it is asynchronous  
//db.select().table('users').then(data => console.log(data));

const app = express();
const port = process.env.PORT || 4000;

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

// app.listen(3000, () => {
//     console.log('smart-brain-api is running on port 3000');
// });

app.listen(port, () => {
    console.log(`smart-brain-api is running on port ${port}`);
});