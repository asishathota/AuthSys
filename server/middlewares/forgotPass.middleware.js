import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const validateUserForgotPass = async (req, res, next) => {
    try {
        const { email } = req.body;

        const isValidUser = await User.findOne({ email });

        if (isValidUser) {
            res.user = isValidUser;
            next()
        }
    } catch (error) {
        console.error("Error in validateUserForgotPass: ", error)
        res.status(400).json({
            msg: error.message
        })
    }
}

export const verifyForgotPassEmail = async (req, res, next) => {
    try {
        const { otp, token } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_PASS)

        const user = await User.findOne({ email: decoded.email })

        if (!user || user.isVerified) {
            return res.status(400).json({
                status: 'fail',
                error: "Invalid"
            })
        }

        if (!user.resetPasswordExpiresAt) {
            return res.status(400).json({
                status: 'fail',
                error: 'no pending verification found, Please request a new OTP'
            })
        }

        const resetPasswordExpiresAt = user.resetPasswordExpiresAt;

        if (Date.now() > resetPasswordExpiresAt) {
            return res.status(400).json({
                msg: 'The OTP has expired'
            })
        }

        if (otp !== user.resetPasswordToken) {
            return res.status(400).json({
                msg: 'The OTP is incorrect'
            })
        }

        user.resetPasswordToken = null;
        user.resetPasswordExpiresAt = null;
        user.resetPass = true;
        await user.save();

        res.json({
            msg: "Reset Pass OTP has verified"
        })
    } catch (error) {
        console.error("Error in verifyemail middleware", error);
        res.status(400).json({
            msg: 'an error has occured'
        })
    }
}

