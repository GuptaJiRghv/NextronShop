import { Router } from 'express';
import { submitContact, subscribeNewsletter } from '../controllers/support.controller.js';
import { validateContact, validateNewsletter } from '../middleware/validate.middleware.js';

const router = Router();

router.post('/contact', validateContact, submitContact);
router.post('/newsletter', validateNewsletter, subscribeNewsletter);

export default router;
