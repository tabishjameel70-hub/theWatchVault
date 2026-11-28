const mongoose = require('mongoose');
isConnected = false
async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("connect to DB!");
  } catch (error) {
    console.error("error connecting to mongoDB", error)
  }
}
module.exports = connectToDB;

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
