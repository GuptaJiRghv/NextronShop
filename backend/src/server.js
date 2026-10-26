import app from './app.js';
import config from './config/index.js';

app.listen(config.port, () => {
    console.log(`Nextron API running on http://localhost:${config.port}`);
    console.log('Storage: in-memory (data resets on restart)');
    console.log('Admin login: admin@nextron.com / admin');
});
