import mongoose from 'mongoose';
import config from './index.js';

/**
 * Connect to MongoDB using Mongoose.
 * Throws on fatal error so the server can handle or exit gracefully.
 */
export const connectDB = async () => {
    if (!config.mongoUri) {
        throw new Error('MONGO_URI is not defined in environment variables.');
    }

    try {
        const conn = await mongoose.connect(config.mongoUri, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error(`[MongoDB] Connection failed: ${error.message}`);
        throw error;
    }
};

export default connectDB;
