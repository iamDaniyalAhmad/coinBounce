const Joi = require('joi')
const User = require('../models/user');
// const bcrypt = require('bcryptjs');
const UserDTO = require('../dto/user');
const JWTServices = require('../Services/JWTServices');
const RefreshToken = require('../models/token')



const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const auth = {
    async register (req, res , next) {
        const userSchema = Joi.object({
            username : Joi.string().min(5).max(30).required(),
            name : Joi.string().max(30).required(),
            email : Joi.string().email().required(),
            password : Joi.string().pattern(passwordPattern).required(),
            cpassword : Joi.ref('password')
        })
        const {error} = userSchema.validate(req.body);
        
        if(error){
            return next(error);
        }

        const {username,name,email,password} = req.body;

        try {
            const emailInUse = await User.exists({email})
            const userNameInUse = await User.exists({username})

            if(emailInUse){
                const error = {
                    status : 409,
                    message : "Email already Exists, Use another Email!",
                }

                return next(error);
            }
            if(userNameInUse){
                const error = {
                    status : 409,
                    message : "Username already taken, Choose another Username"
                }

                return next(error);
            }
            
        } catch (error) {
            return next(error);
        }

        let accessToken;
        let refreshToken;
        let user;
        try {
            const userToRegister = new User({
                name,
                username,
                email,
                password
            })
    
            user = await userToRegister.save();

            accessToken = JWTServices.signAccessToken({_id: user._id}, '30m');
            refreshToken = JWTServices.signRefreshToken({_id : user._id}, '60m')
        } catch (error) {
            return next(error)
        }

        await JWTServices.storeRefreshToken(refreshToken,user._id);

        res.cookie('accessToken', accessToken, {
            maxAge: 1000*60*60*24,
            httpOnly : true
        })
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000*60*60*24,
            httpOnly : true
        })
        

        

        const userDto = new UserDTO(user);

        return res.status(201).json({user : userDto , auth : true});
    },
    async login (req,res,next) {
        const loginSchema = Joi.object({
            username : Joi.string().min(5).max(30).required(),
            password : Joi.string().pattern(passwordPattern).required()
        })

        const {error} = loginSchema.validate(req.body);

        if(error){
            return next(error);
        }
        const {username, password} = req.body;
        let userLogin;
        try {
             userLogin = await User.findOne({username : username});
            

            if(!userLogin){
                const error = {
                    status : 401,
                    message : "Invalid Username"
                }

                return next(error);
            }
            // const Match = await bcrypt.compare(password, userLogin.password) 

            if(!(password===userLogin.password)){
                const error = {
                    status : 401,
                    message : "Invalid Password"
                }

                return next(error);
            }

            
            
        } catch (error) {
            return next(error)
        }

        const accessToken = JWTServices.signAccessToken({_id : userLogin._id}, '30m');
        const refreshToken = JWTServices.signRefreshToken({_id: userLogin._id}, '60m');

        try {
            await RefreshToken.updateOne({
                _id : userLogin._id
            },
            {token : refreshToken},
            {upsert : true}
            )
            
        } catch (error) {
            return next(error)
        }

        res.cookie('accessToken', accessToken, {
            maxAge: 1000*60*60*24,
            httpOnly : true
        })
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000*60*60*24,
            httpOnly : true
        })


        const userDto = new UserDTO(userLogin);
        return res.status(200).json({user:userDto, auth:true});
        
    },
    async logout(req,res,next){
        const {refreshToken} = req.cookies;

        try {
            await RefreshToken.deleteOne({token : refreshToken})
        } catch (error) {
            return next(error)
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');


        res.status(200).json({user: null , auth : false})
    },
    async refresh(req,res,next){
        const orginalRefreshToken = req.cookies.refreshToken;
        let id;
        try {
            id = JWTServices.verifyRefreshToken(orginalRefreshToken)._id;
        } catch (e) {
            const error = {
                status : 401,
                message : 'Unauthorized'
            }
            return next(error)
        }

        try {
            const match = await RefreshToken.findOne({_id : id,token : orginalRefreshToken })

            if(!match){
                const error = {
                    status : 401,
                    message : 'Unauthorized'
                }

                return next(error)
            }
        } catch (error) {
            return next(error)
        }

        try {
            const accessToken =  JWTServices.signAccessToken({_id: id}, '30m');
            const refreshToken =  JWTServices.signRefreshToken({_id : id}, '60m')

            await RefreshToken.updateOne({_id: id}, {token : refreshToken});

            res.cookie('accessToken',accessToken,{
                maxAge : 1000*60*60*24,
                httpOnly : true
            })

            res.cookie('refreshToken',refreshToken,{
                maxAge : 1000*60*60*24,
                httpOnly : true
            })

        } catch (error) {
            return next(error)
        }

        const user = await User.findOne({_id : id});
        const userDTO = new UserDTO(user)

        res.status(200).json({user : userDTO , auth:true})
    }
}

module.exports = auth;