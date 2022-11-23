// Middleware protects routes with authentication against jwt
// jwt module
const jwt = require('jsonwebtoken')
// config module
const config = require('config')

// middleware function has access to req, res objects
// next is callback we have to run once done to move
// to next piece of middleware
module.exports = function(req, res, next) {
    // Get token from header
    // when send req to unprotected route, must send header 
    const token = req.header('x-auth-token')

    // check if not token
    if(!token){
        return res.status(401).json({msg: 'No token, authorization denied'})
    }

    // if token, verify. Else run catch 'Token not valid'
    // decode jwtSecret token, set req.user to user.id from decoded token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded.user
        next()
    } catch(err) {
        res.status(401).json({msg: 'Token is not valid'})
    }
}