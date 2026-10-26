import { ALLOWED_EMAIL_DOMAINS } from './constants.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmailFormat = (email) =>
    typeof email === 'string' && EMAIL_PATTERN.test(email.trim());

/**
 * Sign-up only accepts mainstream email providers.
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateEmailDomain = (email) => {
    if (!isValidEmailFormat(email)) {
        return { valid: false, error: 'Invalid email address.' };
    }

    const domain = email.toLowerCase().trim().split('@').pop();

    if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
        return {
            valid: false,
            error: 'Only Gmail, Outlook, Hotmail, Live, Yahoo, iCloud, Me or Mac email addresses are accepted.',
        };
    }

    return { valid: true, error: null };
};
