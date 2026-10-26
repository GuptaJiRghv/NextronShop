import ApiError from '../utils/ApiError.js';
import { CATEGORY_IDS } from '../utils/constants.js';
import { isValidEmailFormat, validateEmailDomain } from '../utils/emailValidator.js';

const fail = (message) => new ApiError(400, 'VALIDATION_ERROR', message);

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

export const validateSignup = (req, res, next) => {
    const { name, email, password } = req.body ?? {};

    if (!isNonEmptyString(name) || name.trim().length < 2) {
        return next(fail('Name must be at least 2 characters.'));
    }

    const domainCheck = validateEmailDomain(email);
    if (!domainCheck.valid) {
        return next(fail(domainCheck.error));
    }

    if (typeof password !== 'string' || password.length < 6) {
        return next(fail('Password must be at least 6 characters.'));
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body ?? {};

    if (!isValidEmailFormat(email) || typeof password !== 'string' || password.length === 0) {
        return next(fail('Email and password are required.'));
    }

    next();
};

/**
 * Validates and cleans a product payload.
 * With `partial = true` (updates) only the fields that are sent are checked.
 */
export const validateProduct = (partial = false) => (req, res, next) => {
    const body = req.body ?? {};
    const clean = {};
    const present = (key) => body[key] !== undefined;
    const required = (key) => !partial && !present(key);

    if (required('name') || (present('name') && !isNonEmptyString(body.name))) {
        return next(fail('Product name is required.'));
    }
    if (present('name')) clean.name = body.name.trim();

    if (required('category') || (present('category') && !CATEGORY_IDS.includes(body.category))) {
        return next(fail(`Category must be one of: ${CATEGORY_IDS.join(', ')}.`));
    }
    if (present('category')) clean.category = body.category;

    if (required('price') || (present('price') && !(Number(body.price) >= 0 && Number.isFinite(Number(body.price))))) {
        return next(fail('Price must be a number of 0 or more.'));
    }
    if (present('price')) clean.price = Number(body.price);

    if (required('stock') || (present('stock') && !(Number.isInteger(Number(body.stock)) && Number(body.stock) >= 0))) {
        return next(fail('Stock must be a whole number of 0 or more.'));
    }
    if (present('stock')) clean.stock = Number(body.stock);

    if (required('image') || (present('image') && !isNonEmptyString(body.image))) {
        return next(fail('An image URL is required.'));
    }
    if (present('image')) clean.image = body.image.trim();

    if (required('description') || (present('description') && !isNonEmptyString(body.description))) {
        return next(fail('A description is required.'));
    }
    if (present('description')) clean.description = body.description.trim();

    if (present('featured')) clean.featured = Boolean(body.featured);
    if (present('trending')) clean.trending = Boolean(body.trending);

    if (!partial) {
        clean.featured = clean.featured ?? false;
        clean.trending = clean.trending ?? false;
    }

    if (partial && Object.keys(clean).length === 0) {
        return next(fail('No valid fields to update.'));
    }

    req.body = clean;
    next();
};

export const validateContact = (req, res, next) => {
    const { name, email, subject, message } = req.body ?? {};

    if (!isNonEmptyString(name)) return next(fail('Please enter your name.'));
    if (!isValidEmailFormat(email)) return next(fail('Please enter a valid email address.'));
    if (!isNonEmptyString(message) || message.trim().length < 5) {
        return next(fail('Message must be at least 5 characters.'));
    }

    req.body = {
        name: name.trim(),
        email: email.trim(),
        subject: isNonEmptyString(subject) ? subject.trim() : 'General Inquiry',
        message: message.trim(),
    };
    next();
};

export const validateNewsletter = (req, res, next) => {
    if (!isValidEmailFormat(req.body?.email)) {
        return next(fail('Please enter a valid email address.'));
    }
    next();
};
