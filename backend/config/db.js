const mongoose = require('mongoose');
function connectToDB() {
  return mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Server is connected to Database!');
    })
    .catch((err) => {
      console.error('Database connection error:', err);
      process.exit(1);
    });
}

module.exports = connectToDB;