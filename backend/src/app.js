import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import requestLogger from './middleware/logger.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
