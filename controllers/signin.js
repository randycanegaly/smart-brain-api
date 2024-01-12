const handleSignIn = (req, res, db, bcrypt) => {//investigate the const handleSignIn = (db, bcrypt) => (req, res) => { version or similar of this
    //get the email and password from the req
    //select from login db tablewhere email and hashed password match
    //if we get something back from the db, return success
    db.select('email', 'hash').from('login')
    .where(
        {
            email: req.body.email
        })
        .then( data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            // console.log('isValid', isValid);
            //hash the password passed and compare it to the
            //hash for that email in the login table
            if (isValid) {// matches the login table record
                return db.select('*').from('users')//TO DO - I don't understand exactly what this 'return' does
                    .where('email', '=', req.body.email)//get the user matching the email
                    .then(user => {
                        // console.log('user', user);
                        res.json(user[0])//respond with that user
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials');
            }            
        })
        .catch(err => res.status(400).json('wrong credentials'))
        // .catch(err => {console.log(err)})
}

module.exports = {
    handleSignIn: handleSignIn
}