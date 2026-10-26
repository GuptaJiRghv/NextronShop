import ApiError from '../utils/ApiError.js';
import { verifyToken } from '../services/auth.service.js';
import * as UserModel from '../models/user.model.js';

const readToken = (req) => {
    const header = req.header('x-auth-token');
    if (header) return header;

    const bearer = req.header('authorization');
    if (bearer && bearer.startsWith('Bearer ')) return bearer.slice(7);

    return null;
};

/** Requires a valid JWT and attaches the current user to `req.user`. */
export const authenticate = async (req, res, next) => {
    try {
        const token = readToken(req);
        if (!token) {
            throw new ApiError(401, 'NO_TOKEN', 'No token, authorization denied.');
        }

        let decoded;
        try {
            decoded = verifyToken(token);
        } catch {
            throw new ApiError(401, 'INVALID_TOKEN', 'Token is not valid.');
        }

        // Data is in memory, so a restart wipes accounts: re-check the user still exists.
        const user = await UserModel.findById(decoded.user?.id);
        if (!user) {
            throw new ApiError(401, 'SESSION_EXPIRED', 'Your session has expired. Please log in again.');
        }

        req.user = UserModel.toPublic(user);
        next();
    } catch (error) {
        next(error);
    }
};

/** Must run after `authenticate`. */
export const authorizeAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return next(new ApiError(403, 'FORBIDDEN', 'Admin access required.'));
    }
    next();
};
