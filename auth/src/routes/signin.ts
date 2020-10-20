import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@chris-tickets/common';
import { User, UserAttrs } from '../models/user';
import { ParamsDictionary } from 'express-serve-static-core';
import { PasswordManager } from '../services/password-manager';

const router = express.Router();

router.post<ParamsDictionary, any, UserAttrs>(
    '/api/users/signin',
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must provide a password'),
    validateRequest,
    async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            throw new BadRequestError('Invalid credentials');
        }

        const match = await PasswordManager.compare(user.password, password);

        if (!match) {
            throw new BadRequestError('Invalid credentials');
        }

        // Generate jwt
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_KEY!
        );

        // Store token on session object
        req.session = {
            jwt: token
        };

        res.status(200).send(user);
    }
);

export { router as signinRouter };
