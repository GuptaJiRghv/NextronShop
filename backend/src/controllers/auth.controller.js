import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as UserModel from '../models/user.model.js';
import { comparePassword, hashPassword, signToken } from '../services/auth.service.js';

// POST /api/auth/signup
export const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (await UserModel.findByEmail(email)) {
        throw new ApiError(409, 'EMAIL_EXISTS', 'User already exists with this email.');
    }

    const user = await UserModel.create({
        name,
        email,
        password: await hashPassword(password),
    });

    res.status(201).json({ token: signToken(user), user: UserModel.toPublic(user) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
        throw new ApiError(404, 'USER_NOT_FOUND', 'No account found with this email.');
    }

    if (!(await comparePassword(password, user.password))) {
        throw new ApiError(401, 'WRONG_PASSWORD', 'Incorrect password.');
    }

    res.json({ token: signToken(user), user: UserModel.toPublic(user) });
});

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
    res.json({ user: req.user });
});
