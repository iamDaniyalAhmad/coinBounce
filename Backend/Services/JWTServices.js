const jwt = require('jsonwebtoken')
const {ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET} = require('../config/index')
const refreshToken = require('../models/token');

class JWTServices{
    static signAccessToken(payload,expiry){
        return jwt.sign(payload,ACCESS_TOKEN_SECRET,{expiresIn :expiry})
    }
    static signRefreshToken(payload,expiry){
        return jwt.sign(payload,REFRESH_TOKEN_SECRET,{expiresIn :expiry})
    }

    static verifyAccessToken(token){
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    }
    static verifyRefreshToken(token){
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    }

    static async storeRefreshToken(token,userId){
        try {
            const newToken = new refreshToken({
                token : token,
                userId : userId
            })
            
            await newToken.save();
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = JWTServices;