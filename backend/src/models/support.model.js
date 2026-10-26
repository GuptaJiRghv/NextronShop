import { randomUUID } from 'node:crypto';
import { store } from '../data/store.js';

export const createMessage = async ({ name, email, subject, message }) => {
    const entry = {
        id: randomUUID(),
        name,
        email,
        subject,
        message,
        createdAt: new Date().toISOString(),
    };
    store.messages.unshift(entry);
    return entry;
};

export const findAllMessages = async () => [...store.messages];

export const addSubscriber = async (email) => {
    const normalized = String(email).toLowerCase().trim();
    if (store.subscribers.includes(normalized)) return { created: false };
    store.subscribers.push(normalized);
    return { created: true };
};
