import { Router } from "express";
import { signup, login, logout, sendEmail, verifyEmail, delAccount, checkToken, refreshAccessToken, forgotPassSendEmail } from "../controllers/auth.controller.js";
import { validateSignupFields, verifyUserSignup } from "../middlewares/signup.middleware.js";
import { validateSigninFields, verifyUserSignin } from "../middlewares/signin.middleware.js";
import { verifyEmailMiddleware } from "../middlewares/virifyEmail.middleware.js";
import { delAccountMiddleware } from "../middlewares/delAccount.middleware.js";
import { checkTokenMiddleware } from "../middlewares/checkToken.middleware.js";
import { refreshAccessTokenMiddleware } from "../middlewares/refreshToken.middleware.js";
import rateLimit from 'express-rate-limit'
import { validateUserForgotPass, verifyForgotPassEmail } from "../middlewares/forgotPass.middleware.js";
const limitForEmail = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 5,
    message: 'Too many requests from this IP, please try again after 30 minutes.',
    headers: true,
})

const limitForForgotPass = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many requests from this IP, please try again after 1 hour.',
    headers: true,
})

const auth = Router();

auth.post('/signup', validateSignupFields, verifyUserSignup, signup);

auth.post('/sendEmail', limitForEmail, sendEmail)

auth.post('/verifyEmail', verifyEmailMiddleware, verifyEmail)

auth.post('/login', validateSigninFields, verifyUserSignin, login);

auth.post('/logout', logout);

auth.post('/delAccount', checkTokenMiddleware, delAccountMiddleware, delAccount);

auth.get('/refresh', refreshAccessTokenMiddleware, refreshAccessToken);

auth.post('/forgotPass/sendEmail', validateUserForgotPass, forgotPassSendEmail)

auth.post('/forgotPass/verifyEmail', verifyForgotPassEmail)

auth.post('/forgotPass/resetPass',)


auth.post('/test', checkTokenMiddleware, checkToken)

export default auth;