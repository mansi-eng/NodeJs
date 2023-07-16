const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Product = require("../models/product");
//localhost:8000/products/
router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((data) => {
      console.log(data);
      res.status(200).json({
        message: "fetched product data",
        Product_data: data,
      });
    })
    .catch((err) => {
      console.log("err");
      res.status(400).json({
        messsage: "error",
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  //  console.log(req.body);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(201).json({
    message: "success product created ",
    createdProduct: product,
  });
});

//localost:8000/prodcuts/productid
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((data) => {
      if (data) {
        console.log(data);
        res.status(200).json({
          message: "Receive data",
          products: data,
        });
      } else {
        res.status(404).json({ message: " Invalid product id" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: err,
      });
    });
});

router.patch("/:productid", (req, res, next) => {
  const id = req.params.productid;
  const update_Ops = {};
  for (const ops of req.body) {
    update_Ops[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: update_Ops })
    .exec()
    .then((result) => {
      if (result.nModified === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      res.status(200).json({ message: "Product updated", result: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      res.status(200).json({
        message: "Product deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
