const jwt = require("jsonwebtoken");
const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY || 'mysecretkey';
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY || 'myrefreshkey';

const middlewareController = {

    verifyToken: (req, res, next) =>{
        const token = req.headers.token;
        if(token){
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, JWT_ACCESS_KEY, (err, user)=> {
                if(err){
                    // Kiểm tra nếu mã thông báo hết hạn
                    if (err.name === 'TokenExpiredError') {
                        const refreshToken = req.headers.refreshtoken; // Lấy refreshToken từ headers
                        if (!refreshToken) {
                            return res.status(401).json({ error: "Refresh token is not valid!" });
                        }
                        try {
                            const decoded = jwt.verify(refreshToken, JWT_REFRESH_KEY);
                            // Tạo mã thông báo truy cập mới từ mã thông báo làm mới
                            const newAccessToken = jwt.sign(
                                {
                                    id : decoded.id,
                                    admin : decoded.admin
                                },
                                JWT_ACCESS_KEY,
                                {expiresIn: "10s"}
                            );
                            // Gửi lại mã thông báo truy cập mới cho người dùng
                            req.user = decoded;
                            res.setHeader('NewAccessToken', newAccessToken);
                            next();
                        } catch (err) {
                            return res.status(401).json({ error: "Invalid refresh token!" });
                        }
                    } else {
                        res.status(403).json("Token is not valid");
                    }
                } else {
                    req.user = user;
                    next();
                }
            });
        } else {
            res.status(401).json("you're not authenticated");
        }
    },
     verifyTokenAndAdminAuth: (req, res, next) =>{
        middlewareController.verifyToken(req, res,()=>{
            if(req.user.id == req.params.id || req.user.admin){
                next();
            } else{
                res.status(403).json("you're not allow to delete other");
            }
        })
     }
}


module.exports = middlewareController;