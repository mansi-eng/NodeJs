const mongoose = require("mongoose");

//npm install mongodb
//mpm install mongoose

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://paunikarmansi:sgYR2quJgWpNIYkP@cluster0.nmxqzv4.mongodb.net/Cluster0?retryWrites=true&w=majority"
    );
    console.log("connect hogya");
  } catch (error) {
    console.log("error aya");
    console.log(error);
  }
};

module.exports = connectDb;
