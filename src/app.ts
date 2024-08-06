import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

export const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

