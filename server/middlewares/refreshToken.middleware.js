import jwt, { decode } from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js';

export const refreshAccessTokenMiddleware = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                status: "fail",
                msg: "No refresh token provided"
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_PASS);
        } catch (error) {
            console.error("Error in verifyRefreshToken: ", error)
            return res.status(400).json({
                status: "fail",
                msg: error.message
            })
        }

        if (!decoded) {
            return res.status(400).json({
                msg: 'Invalid refresh token'
            });
        }

        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                msg: 'user doesnt exist'
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashsedRefreshToken = await bcryptjs.hash(refreshToken, salt)

        const storedHashToken = user.refreshToken;

        const validRefreshToken = await bcryptjs.compare(hashsedRefreshToken, storedHashToken)

        if (!validRefreshToken) {
            return res.status(400).json({
                status: "fail",
                msg: "invalid Refresh token"
            })
        }

        res.email = decoded.email;

        next();

    } catch (error) {
        console.error("Error in refreshAccessTokenMiddleware: ", error)
        return res.status(400).json({
            msg: 'an error has occured'
        })
    }
}