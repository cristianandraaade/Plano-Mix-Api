import dotenv from 'dotenv';
import express from 'express';
import routes from './src/Routes/router.js';

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use('/api/v1/', routes);

app.listen(port, () => {
        console.log(`
        ===================================================
               Server listening on port ${port}
        ===================================================
        `)
});