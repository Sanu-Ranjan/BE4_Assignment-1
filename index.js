require("dotenv").config();
const express = require("express");
const { connectDb } = require("./db/db.connect");

const app = express();

app.use(express.json());

(async () => {
  await connectDb();

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
  });
})();
