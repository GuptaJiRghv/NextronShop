import app from './app.js';
import config from './config/index.js';
import connectDB from './config/db.js';
import seedInitialData from './data/seed.js';

const startServer = async () => {
    try {
        await connectDB();
        await seedInitialData();

        app.listen(config.port, '0.0.0.0', () => {
            console.log(`Omnyx API running on http://0.0.0.0:${config.port}`);
            console.log('Storage: MongoDB Atlas (connected)');
            console.log('Admin login: admin@omnyx.com / admin');
        });
    } catch (error) {
        console.error('Fatal: Failed to start server due to database connection error:', error.message);
        process.exit(1);
    }
};

startServer();
