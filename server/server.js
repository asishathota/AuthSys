import express from 'express';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';


dotenv.config()

const app = express();

app.use(express.json())
app.use(cors())
app.use(cookieParser())



app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 6000

app.listen(PORT, () => {
    console.log("App is running on port no: " + PORT);
    connectDB();
})
