import { body, validationResult } from 'express-validator'
import User from '../models/user.model.js';

export const validateSignupFields = [
    body('username')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Username must be at least 3 characters long'),

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

export const verifyUserSignup = async (req, res, next) => {
    const { username, email } = req.body;

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        return res.status(400).json({
            status: 'fail',
            error: "User already Exists with this username / email"
        })
    }

    next();
}