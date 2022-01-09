const mongoose = require('mongoose');

mongoose.connection.once('open', () => {
  console.log('MongoDB Connected!!!');
});

mongoose.connection.on('error', (err) => {
  console.error(err.message);
});

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    throw new Error(error.message);
  }
};

const disconnectMongoDB = async () => {
  await mongoose.disconnect();
};

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
};
