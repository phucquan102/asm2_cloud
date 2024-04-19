require('dotenv').config();
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_ACCESS_KEY = 'mysecretkey';
const JWT_REFRESH_KEY = 'myrefreshkey';

let refreshTokens = [];
const authController = {
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);  
            const hashed = await bcrypt.hash(req.body.password, salt);
        
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });
            const user = await newUser.save();  
            res.status(200).json(user);
        } catch(err) {
            res.status(500).json({ error: err.message });
        }
    },
 

    //generate accesstoken
    generateAccessToken: (user) =>{
        return jwt.sign(
            {
                id : user.id,
                admin : user.admin
            },
            JWT_ACCESS_KEY,
            {expiresIn: "20s"}
       );
    },

    generateRefreshToken: (user)=>{
       return  jwt.sign(
            {
                id : user.id,
                admin : user.admin
            },
            JWT_REFRESH_KEY,
            {expiresIn: "7d"} 
        );
    },

    loginUser: async(req, res)=>{
        try{
            const user = await User.findOne({username: req.body.username});
            if(!user){
                return res.status(404).json({ error: "Wrong username!" });
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if(!validPassword){
                return res.status(404).json({ error: "Wrong password!" });
            } 
            if (user && validPassword) {
                const accesstoken  =  authController.generateAccessToken(user);
               const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken)
                res.cookie("refreshToken", refreshToken,{
                    httpOnly:true,
                    secure: false,
                    path: "/",
                    samSite: "strict",
                })
               const {password, ...others} = user._doc;
               res.status(200).json({ ...others, accesstoken  });
        }
        } catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json("You're not authenticated");
        
        // Xác minh tính hợp lệ của refreshToken
        jwt.verify(refreshToken, JWT_REFRESH_KEY, async (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(403).json("Refresh token is not valid");
            }
            try {
                // Tìm thông tin user từ cơ sở dữ liệu
                const user = await User.findById(decoded.id);
 
                    const newAccessToken = authController.generateAccessToken(user);
                    const newRefreshToken = authController.generateRefreshToken(user);
    
                // Cập nhật refreshToken mới vào danh sách refreshTokens
                refreshTokens = refreshTokens.filter(token => token !== refreshToken);
                refreshTokens.push(newRefreshToken);
    
                // Set cookie với refreshToken mới
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
 
                res.status(200).json({ accessToken: newAccessToken });
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: error.message });
            }
        });
    },
    userLogout: async (req, res)=> {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("Logged out");
    }
    
    
};

//logout

module.exports = authController;
