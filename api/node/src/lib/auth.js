
const jwt = require('jsonwebtoken');
const errors = require('./errors.js');
const globals = require('./globals.js');
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;



function authenticateUser(token, privillege_level='player') {
    
    // Disable tokens on debug
    if(globals.DEBUG) return token;

    var decoded;

    try {
        decoded = jwt.verify(token, Buffer.from(JWT_PUBLIC_KEY, 'base64').toString('ascii'));
    } catch(e)
    {
        throw new errors.AnauthorizedException("Access is denied");
    }
   
    if(!decoded || !decoded.data || !decoded.data.username || !decoded.data.roles || !Array.isArray(decoded.data.roles))
        throw new errors.AnauthorizedException("Malformed token");

    //console.log(decoded);
    
    var p_level = (x) => {return ['player','official','admin'].indexOf(x)};

    // if(p_level(decoded.data.role) == -1) throw new errors.AnauthorizedException("Malformed token");

    if(decoded.data.roles.indexOf(privillege_level) == -1) 
        throw new errors.AnauthorizedException("Not enough privilleges");

    return decoded.data.username;
}

module.exports = {
    authenticateUser:authenticateUser
}