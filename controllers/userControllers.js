import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/userModels.js';

import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';
import matchPasswords from '../utils/matchPasswords.js';
import hashPassword from '../utils/hashPassword.js';

const userControllers = {
    register: async (req, res) => {
        try {
            const { email, password, rePassword } = req.body;
            const userExist = await User.findOne({ email: email });

            if (userExist) {
                return res.status(409).json({
                    message: `User with email ${email} already exists`
                });
            } else {
                const isValidEmail = validateEmail(email);
                const isValidPassword = validatePassword(password);
                const isMatch = matchPasswords(password, rePassword);

                if (isValidEmail && isValidPassword && isMatch) {
                    const hashedPassword = hashPassword(password);

                    const newUser = await User.create({
                        email: email,
                        password: hashedPassword
                    });

                    return res.status(201).json({
                        message: 'User registered successfully',
                        user: newUser
                    });
                } else {
                    return res.status(400).json({
                        message:
                            'Invalid email, password, or password confirmation.'
                    });
                }
            }
        } catch (err) {
            console.error('Error during registration:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const isExistUser = await User.findOne({ email: email });
            console.log(`User from my DB: ` + isExistUser); //

            if (isExistUser) {
                bcrypt.compare(
                    password,
                    isExistUser.password,
                    (err, isValid) => {
                        if (isValid) {
                            const token = jwt.sign(
                                { user: isExistUser },
                                process.env.TOKEN_ACCESS_SECRET
                            );
                            console.log(`token : ${token}`); //
                            res.cookie('token', token, { httpOnly: true });
                            return res.status(200).json({
                                message: 'Login successful',
                                token: token
                            });
                        } else {
                            return res.status(409).json({
                                message: 'Email or password is not correct'
                            });
                        }
                    }
                );
            } else {
                return res.status(409).json({ message: 'User does not exist' });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    logout: (req, res) => {
        res.clearCookie('token');
        return res.status(200).json({ message: `User logged out` });
    }
};

export default userControllers;
