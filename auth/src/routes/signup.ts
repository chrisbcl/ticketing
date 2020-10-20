import express from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@chris-tickets/common';
import { User, UserAttrs } from '../models/user';
import { ParamsDictionary } from 'express-serve-static-core';

const router = express.Router();

router.post<ParamsDictionary, any, UserAttrs>(
    '/api/users/signup',
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
    validateRequest,
    async (req, res) => {
        const { email, password } = req.body;

        const userExists = await User.exists({ email });

        if (userExists) {
            throw new BadRequestError('Email in use');
        }

        const user = User.build({ email, password });

        try {
            await user.save();
        } catch (error) {
            console.log(error);
            throw new BadRequestError('Error saving user into database');
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

        res.status(201).send(user);
    }
);

export { router as signupRouter };
