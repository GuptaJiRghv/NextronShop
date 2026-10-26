import dotenv from 'dotenv';

dotenv.config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
    jwtSecret: process.env.JWT_SECRET || 'nextron_dev_secret_change_me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

if (!process.env.JWT_SECRET && config.env === 'production') {
    console.warn('[config] JWT_SECRET is not set. Set it in your .env before deploying.');
}

export default config;
