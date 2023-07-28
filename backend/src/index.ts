import mongoose, { ErrorHandlingMiddlewareFunction } from 'mongoose';
import { app } from './app';

import dotenv from 'dotenv';
import { CustomError } from './errors/custom-error';

dotenv.config();

mongoose.set('strictQuery', false);

const start = async () => {
  console.log('Starting up......');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log('conneted to mongodb');
  } catch (error: any) {
    console.error(error.message);
  }
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db...');
  });
  mongoose.connection.on('error', (err) => {
    console.log(err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected...');
  });

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on port ${process.env.PORT} !!`);
  });
};

start();
