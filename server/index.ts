require('dotenv').config();
const mongoose = require('mongoose');
import { Request, Response } from './types/expressTypes';
const express = require('express');
require('express-async-errors');
const app = express();
const port = process.env.PORT || 3000;

const { MONGO_USERNAME, MONGO_PASSWORD } = process.env;

mongoose
  .connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.dbg8phn.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
  })
  .then(async () => {
    console.log('mongo connected');
  })
  .catch(console.error);

const session = require('express-session');
const expressSessionMiddleware = session({
  secret: process.env.SESSION_KEY || 'nevergonnagiveyouup',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 72 * 60 * 60 * 1000, // 72 hours
  },
});
app.use(expressSessionMiddleware);

app.use(express.json());
app.use(express.static('../build'));

const identity = require('./endpoints/identity');
app.use('/identity', identity);

const organization = require('./endpoints/organization');
app.use('/organization', organization);

app.use((err: any, req: Request, res: Response, next: any) => {
  // Handle the error in a graceful way
  console.error(err);

  // Send an appropriate response to the client
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
