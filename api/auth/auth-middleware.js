
const Auth = require('./auth-model')

const checkUsernameExists = async (req, res, next) => {
    try{
        const [username] = await Auth.findBy({ username: req.body.username })
        if(username) {
           return next({ status: 400, message: "username taken" })
        }
        next() 
    }catch(err){
        next(err)
    }
}
const checkBodyExists = async (req, res, next) => {
    if(!req.body || req.body.username === undefined || req.body.password === undefined){
        next({ status: 401, message: "username and password required" })
    }else{
        next()
    }
}

module.exports = {
    checkUsernameExists,
    checkBodyExists
}