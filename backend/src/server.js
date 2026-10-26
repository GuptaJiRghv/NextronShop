import app from './app.js';
import config from './config/index.js';

app.listen(config.port, '0.0.0.0', () => {
    console.log(`Nextron API running on http://0.0.0.0:${config.port}`);
    console.log('Storage: in-memory (data resets on restart)');
    console.log('Admin login: admin@nextron.com / admin');
});

