import mongoose from 'mongoose';

import { DB_URL, NODE_ENV } from '../config/env.js';

if (!DB_URL) {
  throw new Error(
    'Please define DB_URL in your environment variables inside .env< development / production >.local file'
  );
}
const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(DB_URL);
    console.log(
      { NODE_ENV },
      'Connected to MongoDB successfully',
      connection.connection.name
    );
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectToDatabase;
