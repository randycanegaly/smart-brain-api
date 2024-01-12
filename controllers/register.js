const handleRegister = (req, res, db, bcrypt) => {
    console.log('in register, body:', req.body);
    const { email, name, password } = req.body;//the web page is requesting server to register by passing these in the request body
    const hash = bcrypt.hashSync(password);
    console.log('in register, email:', email, 'name:', name, 'password:', password);
        db.transaction(trx => {//need to do 2 db operations and they must fail
            //together or succeed together. so, bundle them in the same transaction
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')//put the email address and hashed pw into the login table
            .returning('email') //get back from the database the email we put in
            .then(loginEmail => {//process as 'loginEmail' so we keep track that it's different
                return trx('users')//return here because then returns a promise and
                //the function passed in has to return what that promise will resolve to
                //Note 'trx' to show working the second part within the transaction
                //causes an array of objects to be returned, one for each row inserted.
                //each object has properties for the arguments of returning()
                .returning( '*' )//will insert into the users table and then return the email and name values inserted
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                })//so we just split and did 2 inserts, one to the login table and
                //one to the users table. Note email in both, that's the foreign key
                //and that only login has the hashed password
                .then(user => {
                    res.json(user[0]);//returns an array, so index in. Should only be registering one at a time so OK.
                })
            })
            .then(trx.commit)//commit the transaction bundle
            .catch(trx.rollback)//something bad happened, back all out      
        })
        .catch(err => res.status(400).json('unable to register'))    
}

module.exports = {
    handleRegister: handleRegister
}