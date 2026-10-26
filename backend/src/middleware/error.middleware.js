import config from '../config/index.js';
import ApiError from '../utils/ApiError.js';

export const notFound = (req, res, next) => {
    next(new ApiError(404, 'NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found.`));
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    // Malformed JSON body
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'INVALID_JSON', message: 'Request body is not valid JSON.' });
    }

    const status = err.status || 500;

    if (status >= 500) {
        console.error(err);
    }

    res.status(status).json({
        error: err.code || 'SERVER_ERROR',
        message:
            status >= 500 && config.env === 'production'
                ? 'Something went wrong on our side.'
                : err.message || 'Something went wrong.',
    });
};
