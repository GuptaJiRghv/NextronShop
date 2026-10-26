import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { toPublic } from '../models/user.model.js';

export const hashPassword = (plain) => bcrypt.hash(plain, 10);

export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

/** Signs a JWT whose payload is `{ user: { id, name, email, role } }`. */
export const signToken = (user) =>
    jwt.sign({ user: toPublic(user) }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

/** @throws if the token is missing, malformed or expired */
export const verifyToken = (token) => jwt.verify(token, config.jwtSecret);
