require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDb } = require("./db/db.connect");
const { Book } = require("./models/book.models");

const app = express();

app.use(cors());
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

const homePath = "/neog/BE/4/Assignment_1";

app.get(`${homePath}/books`, async (req, res) => {
  const { data, error } = await getAll();
  if (error) {
    console.log("db error: fetching all books", error);
    return res
      .status(500)
      .json(fail("Internal server error: database operation failed"));
  }

  res.status(200).json(success("books fetched successfully", { books: data }));
});

app.get(`${homePath}/books/:title`, async (req, res) => {
  const { title } = req.params;

  const { data, error } = await findOne({ title: title });
  if (error) {
    console.log("db error: fetching a book by title ", error);
    return res
      .status(500)
      .json(fail("Internal server error: databse operation failed"));
  }

  if (!data) return res.status(404).json(fail("No Book found"));

  res.status(200).json(success("Book fetched successfully", { data: data }));
});

app.get(`${homePath}/books/author/:author`, async (req, res) => {
  const { author } = req.params;

  const { data, error } = await findAll({ author: author });
  if (error) {
    console.log("db error: fetching books by author", error);
    return res
      .status(500)
      .json(fail("Internal server error: db operation failed"));
  }

  if (data.length === 0) return res.status(404).json(fail("No books found"));

  res.status(200).json(success("Books fetched successfully", { data: data }));
});

app.get(`${homePath}/books/business`, async (req, res) => {
  const { data, error } = await findAll({ genre: "Business" });
  if (error) {
    console.log("db error: fetching books by genre business", error);
    return res
      .status(500)
      .json(fail("Internal server error: db operation failed"));
  }

  if (data.length === 0) return res.status(404).json(fail("No books found"));

  res.status(200).json(success("Books fetched successfully", { data: data }));
});

app.get(`${homePath}/books/release/year/2012`, async (req, res) => {
  const { data, error } = await findAll({ publishedYear: 2012 });
  if (error) {
    console.log("db error: fetching books by release year 2012", error);
    return res
      .status(500)
      .json(fail("Internal server error: db operation failed"));
  }

  if (data.length === 0) return res.status(404).json(fail("No books found"));

  res.status(200).json(success("Books fetched successfully", { data: data }));
});

app.post(`${homePath}/books/update/:id`, async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const { error, data } = await updateById(id, { rating: rating });
  if (error) {
    console.log("db error: updating by id", error);
    res.status(500).json(fail("Internal server error: db operation failed"));
  }

  res.status(200).json(success("Book updated", { data: data }));
});

app.post(`${homePath}/books/update/title/:title`, async (req, res) => {
  const { title } = req.params;
  const { rating } = req.body;
  const { error, data } = await updateBytitle(title, { rating: rating });
  if (error) {
    console.log("db error: updating by title", error);
    res.status(500).json(fail("Internal server error: db operation failed"));
  }

  res.status(200).json(success("Book updated", { data: data }));
});

app.delete(`${homePath}/books/id/:id`, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await deleteById(id);
  if (error) {
    console.log("db error: delete book by id", error);
    return res
      .status(500)
      .json(fail("Internal server error: db operation failed"));
  }

  if (!data)
    return res.status(404).json(fail("Book not found", { bookId: id }));

  res.status(200).json(success("Books deleted", { data: data }));
});

app.post(`${homePath}/books/add`, async (req, res) => {
  const book = req.body;
  const { data, error } = await addBook(book);
  if (error) {
    console.log("db error: add book", error);
    return res.status(500).json("Internal server error: db operation failed");
  }

  res.status(201).json(success("Book added successfully", { data: data }));
});

(async () => {
  await connectDb();

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
  });
})();
