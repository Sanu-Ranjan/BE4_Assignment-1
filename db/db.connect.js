const mongoose = require("mongoose");

const connectDb = async () => {
  const mongoUri = process.env.MONGODB;

  if (!mongoUri) {
    console.log("Fatal error no mongouri set");
    process.exit(1);
  }

  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("connected to mongodb");
    })
    .catch((error) => {
      console.log("Error connecting to mongodb", error);
      process.exit();
    });
};

module.exports = {
  connectDb,
};
