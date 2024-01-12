const handleProfile = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length) {
            res.json(user[0]);//respond with json of the user returned from the db
        } else {
            res.status(400).json('Not found')
        }        
    })
    .catch(err => res.status(400).json('error getting user'))
}

module.exports = {
    handleProfile: handleProfile
}