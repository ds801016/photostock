const mongoose = require("mongoose");

const dbConnect = async () => {
  // console.log(process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("database connected");
  } catch (e) {
    console.log(e);
  }
};

module.exports = dbConnect;
