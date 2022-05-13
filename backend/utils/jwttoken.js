const dotenv = require('dotenv')
dotenv.config()



const jwtToken = (user, statusCode, res) => {
    const token = user.getJwtToken()


    //generating ccokie options by giving
    const options = {
        expires: new Date(Date.now() + process.env.EXPIRE_COOKIE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    res.status(statusCode).cookie('token', token, options).json({sucess: true, user, token})
}


module.exports = jwtToken
