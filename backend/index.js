import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import Accountrouter from './routes/account.route.js'
const app = express();



// Enable CORS
app.use(cors({
    origin: "http://localhost:5173"
}));


// Load environment variables
dotenv.config();

// Parse JSON bodies
app.use(bodyParser.json());

app.use('/api/account',Accountrouter)

// Set port (you can also use process.env.PORT)
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
