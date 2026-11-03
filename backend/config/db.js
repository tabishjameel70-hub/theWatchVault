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