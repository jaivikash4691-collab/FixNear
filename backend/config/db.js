import mongoose from 'mongoose';

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fixnear';
  const fallbackUri = 'mongodb://127.0.0.1:27017/fixnear';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[Database Warning] Primary connection failed: ${error.message}`);

    if (primaryUri !== fallbackUri) {
      try {
        console.log(`[Database] Trying fallback to local MongoDB: ${fallbackUri}`);
        const fallbackConn = await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`[Database] Fallback MongoDB Connected: ${fallbackConn.connection.host}/${fallbackConn.connection.name}`);
        return;
      } catch (fallbackError) {
        console.error(`[Database Error] Fallback connection also failed: ${fallbackError.message}`);
      }
    }

    console.error(`[Database Error] Could not connect to any MongoDB instance.`);
    process.exit(1);
  }
};

export default connectDB;

