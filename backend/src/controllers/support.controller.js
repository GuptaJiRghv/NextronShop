import asyncHandler from '../utils/asyncHandler.js';
import * as SupportModel from '../models/support.model.js';

// POST /api/support/contact
export const submitContact = asyncHandler(async (req, res) => {
    await SupportModel.createMessage(req.body);
    res.status(201).json({ msg: 'Thanks! Your message has been received.' });
});

// POST /api/support/newsletter
export const subscribeNewsletter = asyncHandler(async (req, res) => {
    const { created } = await SupportModel.addSubscriber(req.body.email);
    res.status(created ? 201 : 200).json({
        msg: created ? 'You are subscribed to Nextron updates.' : 'You are already subscribed.',
    });
});
