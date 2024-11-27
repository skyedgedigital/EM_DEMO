
'use server'
import mongoose from 'mongoose'

const connectToDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      return;
    }
    // Connect to MongoDB
    // await mongoose.connect(
    //   process.env.NODE_ENV === 'production'
    //     ? process.env.DATABASE_URL!
    //     : process.env.DATABASE_URL_DEV!
    // );

    // await mongoose.connect(
    //   "mongodb+srv://aditya:test@cluster0.yo9w5as.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    // );

    let dbString:string = ''

    dbString = process.env.NODE_ENV === 'development' ? process.env.DATABASE_URL_DEV : process.env.DATABASE_URL_PRD

    // await mongoose.connect(
    //   "mongodb+srv://admin:admin@cluster0.y63gp.mongodb.net/se-prd"
    // );

    await mongoose.connect(`${dbString}`)

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};
export default connectToDB;