import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

import cors from 'cors';
import userRoute from './routes/user.js';
import ticketRoute from './routes/ticket.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', userRoute)
app.use('/tickets', ticketRoute)

mongoose.connect(process.env.DB_CONNECTION).then(() => {
    console.log('Connected to the DB')
}).catch((err) => {
    console.log('Error', err)
})
app.listen(process.env.PORT, () => {
    console.log(`App started on ${process.env.PORT}`)
})
