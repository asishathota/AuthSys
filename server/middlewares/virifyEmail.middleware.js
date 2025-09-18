import User from '../models/user.model.js';

export const verifyEmailMiddleware = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email })

        if (!user || user.isVerified) {
            return res.status(400).json({
                status: 'fail',
                error: "Invalid"
            })
        }

        if (!user.verificationTokenExpiresAt) {
            return res.status(400).json({
                status: 'fail',
                error: 'no pending verification found, Please request a new OTP'
            })
        }

        const verificationTokenExpiresAt = user.verificationTokenExpiresAt;

        if (Date.now() > verificationTokenExpiresAt) {
            return res.status(400).json({
                msg: 'The OTP has expired'
            })
        }

        if (otp !== user.verificationToken) {
            return res.status(400).json({
                msg: 'The OTP is incorrect'
            })
        }

        res.user = user;

        next()
    } catch (error) {
        console.error("Error in verifyemail middleware", error);
        res.status(400).json({
            msg: 'an error has occured'
        })
    }
}