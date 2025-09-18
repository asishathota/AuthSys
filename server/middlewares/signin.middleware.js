import { body, validationResult } from 'express-validator'
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs'

export const validateSigninFields = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 8 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'fail',
                errors: errors.array()
            });
        }
        next();
    }
]

export const verifyUserSignin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: 'fail',
                error: "Invalid email or password"
            });
        }

        if (user.isVerified === false) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email has not been verified.'
            });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                status: 'fail',
                error: "Invalid email or password"
            });
        }

        res.user = user;
        next();

    } catch (error) {
        console.error("Login verification error:", error);
        return res.status(500).json({
            status: 'error',
            error: 'An internal server error occurred.'
        });
    }
};