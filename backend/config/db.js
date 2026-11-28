const mongoose = require('mongoose');
let connectionPromise = null;
const connectToDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing');
  }
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI)
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error(`MongoDB Error: ${error.message}`);
        throw error;
      });
  }

  return connectionPromise;
};

module.exports = connectToDB;

// const mongoose = require('mongoose');
// isConnected = false
// async function connectToDB() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     isConnected = true;
//     console.log("connect to DB!");
//   } catch (error) {
//     console.error("error connecting to mongoDB", error)
//   }
// }
// module.exports = connectToDB;

// const mongoose = require('mongoose');
// let isConnected = false;

// async function connectToDB() {
//     try {
//         // Reuse an existing connection
//         if (isConnected && mongoose.connection.readyState === 1) {
//             return;
//         }

//         await mongoose.connect(process.env.MONGO_URI);

//         isConnected = true;
//         console.log("Connected to MongoDB!");

//     } catch (error) {
//         isConnected = false;

//         console.error("Error connecting to MongoDB:", error);

//         throw error;
//     }
// }
// module.exports = connectToDB;
