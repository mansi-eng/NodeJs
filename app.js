const express = require("express");

const app = express();

const morgan = require("morgan");
const bodyParser = require("body-parser");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const singUp = require("./api/routes/user");

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//defining routes
//localhost:8000/products
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/user", singUp);
app.use((req, res, next) => {
  const error = new Error("api not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      error: "ndjru",
      message: error.message,
    },
  });
});

module.exports = app;
