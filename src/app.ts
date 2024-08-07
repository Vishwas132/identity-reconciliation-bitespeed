import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { contactController } from './controllers/contact.js';

export const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', contactController);

// Health check
app.get('/', (req, res) => {
  res.send('Working!');
});
