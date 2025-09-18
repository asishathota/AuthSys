import User from "../models/user.model.js"
import bcryptjs, { truncates } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generate as generateOTP } from 'otp-generator';
import SibApiV3Sdk from 'sib-api-v3-sdk';


export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const salt = await bcryptjs.genSalt(10);
        const hashPass = await bcryptjs.hash(password, salt)

        const user = await User.create({
            username, email, password: hashPass
        })

        console.log(user)

        res.json({
            status: 'success',
            user
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'fail',
            error
        })
    }

}

export const sendEmail = async (req, res) => {
    try {

        var defaultClient = SibApiV3Sdk.ApiClient.instance;
        var apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        console.log(process.env.BREVO_API_KEY)
        console.log("hello")

        var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found.");
        }
        const otp = generateOTP(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
        const header = "You recently requested a one-time password to verify your account. Please use the following code:"

        user.verificationToken = otp;
        user.verificationTokenExpiresAt = Date.now() + 30 * 60 * 1000;

        await user.save()

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.to = [{ email: user.email, name: user.username }];
        sendSmtpEmail.templateId = 1;
        sendSmtpEmail.params = { otp, header };


        const brevoResponse = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('API called successfully. Returned data: ', brevoResponse);
        res.json({
            msg: "OTP sent successfully"
        })
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.body : error);
        res.status(500).json({
            msg: "Error sending OTP",
            error: error.message,
        });
    }


}

export const verifyEmail = async (req, res) => {
    try {

        const user = res.user;

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiresAt = null;
        await user.save();
        return res.json({
            status: 'success',
            msg: 'user has been verified',
            user
        })
    } catch (error) {
        console.error("error in verifyEmail");
        res.status(400).json({
            status: 'fail',
            msg: 'an error has occured'
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = res.user;
        user.lastLogin = Date.now();
        await user.save();

        const payload = {
            id: user._id
        }

        const jwt_pass = process.env.JWT_PASS;

        const accessToken = jwt.sign(payload, jwt_pass, { expiresIn: "5m" })
        const refreshToken = jwt.sign(payload, jwt_pass, { expiresIn: "7d" })

        const salt = await bcryptjs.genSalt(10);
        const hashsedRefreshToken = await bcryptjs.hash(refreshToken, salt)

        user.refreshToken = hashsedRefreshToken;
        user.lastLogin = Date.now();
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            status: 'success',
            accessToken,
            user
        })
    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({
            status: 'fail',
            message: 'Server error during login',
            error: error.message
        })
    }
}

export const logout = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        user.lastLogin = null;
        user.refreshToken = null;
        await user.save();

        res.json({
            status: "success",
            msg: "user successfylly Logged out"
        })
    } catch (error) {
        console.error("Error in loggin out", error);
        res.status(400).json({
            status: 'fail',
            msg: "cant logout user"
        })
    }
}

export const delAccount = async (req, res) => {
    try {
        const email = res.email;

        const user = await User.findOneAndDelete({ email })

        if (!user) {
            res.status(400).json({
                status: "fail",
                msg: "user doesnt exists"
            })
        }

        res.json({
            status: "success",
            msg: "user successfully deleted"
        })

    } catch (error) {
        console.error("Error in delAccount: ", error)
        res.status(400).json({
            status: "fail",
            msg: "an error has occured in del account"
        })
    }
}

export const refreshAccessToken = async (req, res) => {
    try {
        const email = res.email;

        const accessToken = jwt.sign({ email }, process.env.JWT_PASS, { expiresIn: "5m" })

        res.json({
            accessToken
        })
    } catch (error) {
        console.error("Error in refreshAccessToken: ", error)
        res.json({
            status: 'fail',
            msg: error.message
        })
    }
}

export const forgotPassSendEmail = async (req, res) => {
    try {

        var defaultClient = SibApiV3Sdk.ApiClient.instance;
        var apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        console.log(process.env.BREVO_API_KEY)
        console.log("hello")

        var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


        const user = res.user;
        const token = jwt.sign({ email }, process.env.JWT_PASS, { maxAge: '15m' })

        const otp = generateOTP(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
        const header = "You recently requested a one-time password to reset your account password. Please use the following code:"

        user.resetPasswordToken = otp;
        user.resetPasswordExpiresAt = Date.now() + 30 * 60 * 1000;

        await user.save()

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.to = [{ email: user.email, name: user.username }];
        sendSmtpEmail.templateId = 1;
        sendSmtpEmail.params = { otp, header };


        const brevoResponse = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('API called successfully. Returned data: ', brevoResponse);
        res.json({
            msg: "OTP sent successfully",
            forgotPassToken: token
        })
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.body : error);
        res.status(500).json({
            msg: "Error sending OTP",
            error: error.message,
        });
    }
}

export const resetPass = async (req, res) => {
    try {
        const { newPass, token } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_PASS)

        const user = await User.findOne({ email: decoded.email })

        if (!user.resetPass) {
            return res.json({
                msg: 'an error occured'
            })
        }
        const salt = await bcryptjs.genSalt(10)
        const hashPass = await bcryptjs.hash(newPass, salt)

        user.password = hashpass;
        user.resetPass = false;
        await user.save()

        res.json({
            msg: "password has changed / reset"
        })
    } catch (error) {
        console.error('Error in resetPass:', error.response ? error.response.body : error);
        res.status(500).json({
            msg: "Error resetting password",
            error: error.message,
        });
    }
}

export const checkToken = async (req, res) => {
    res.send("ok")
}