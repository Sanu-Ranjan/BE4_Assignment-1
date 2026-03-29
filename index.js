require("dotenv").config();
const express = require("express");
const { connectDb } = require("./db/db.connect");
const { Book } = require("./models/book.models");

const app = express();

app.use(express.json());

const dataObj = {
  data: (data) => ({ data: data, error: null }),
  error: (error) => ({ data: null, error: error }),
};

const success = (message, data) => ({
  success: true,
  message,
  data,
});

const fail = (message, details = null) => ({
  success: false,
  error: message,
  details,
});

const addBook = async (bookData) => {
  try {
    const savedBook = await Book.create(bookData);
    return dataObj.data(savedBook);
  } catch (error) {
    return dataObj.error(error);
  }
};

const getAll = async () => {
  try {
    const data = await Book.find();
    return dataObj.data(data);
  } catch (error) {
    return dataObj.data(data);
  }
};

const findOne = async (querryParam) => {
  try {
    const data = await Book.findOne(querryParam);
    return dataObj.data(data);
  } catch (error) {
    return dataObj.error(error);
  }
};

const findAll = async (querryParam) => {
  try {
    const data = await Book.find(querryParam);
    return dataObj.data(data);
  } catch (error) {
    return dataObj.error(error);
  }
};

const updateById = async (id, updateData) => {
  try {
    const data = await Book.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });
    return dataObj.data(data);
  } catch (error) {
    return dataObj.error(error);
  }
};

const updateBytitle = async (title, updatedData) => {
  try {
    const data = await Book.findOneAndUpdate({ title: title }, updatedData, {
      returnDocument: "after",
    });
    return dataObj.data(data);
  } catch (error) {
    return dataObj.error(error);
  }
};

const deleteById = async (id) => {
  try {
    const data = await Book.findByIdAndDelete(id, { returnDocument: "before" });
    return dataObj.data(data);
  } catch (error) {
    return dataObj.error(error);
  }
};

(async () => {
  await connectDb();

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
  });
})();
