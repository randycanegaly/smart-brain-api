const handleSignIn = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }
    //TO DO - how are req and res in scope here? How does this parameter chaining work?
    //get the email and password from the req
    //select from login db tablewhere email and hashed password match
    //if we get something back from the db, return success
    db.select('email', 'hash').from('login')
    .where(
        {
            email: email
        })
        .then( data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            // console.log('isValid', isValid);
            //hash the password passed and compare it to the
            //hash for that email's password in the login table
            if (isValid) {// matches the login table record
                return db.select('*').from('users')//TO DO - I don't understand exactly what this 'return' does
                    .where('email', '=', email)//get the user matching the email
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