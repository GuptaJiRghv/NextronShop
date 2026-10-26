/**
 * Error with an HTTP status and a machine-readable code.
 * The error middleware turns it into: { error: CODE, message }
 */
export default class ApiError extends Error {
    constructor(status, code, message) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
    }
}
