const Product = require("../models/product");
const mongoose = require("mongoose");

exports.product_getALL = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((data) => {
      //  console.log(data);
      const response = {
        count: data.length,
        products: data.map((item) => {
          return {
            name: item.name,
            price: item.price,
            productImage: item.productImage,
            id: item._id,
            request: {
              type: "GET",
              url: "localhost:8000/products/" + item._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log("err");
      res.status(400).json({
        messsage: "error",
        error: err,
      });
    });
};

exports.create_product = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "success product created ",
        createdProduct: {
          name: result.name,
          price: result.price,
          id: result._id,
          request: {
            type: "GET",
            url: "localhost:8000/products/" + result.id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.get_product = (req, res, next) => {
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
};

exports.update_product = (req, res, next) => {
  console.log("pathch");
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
};

exports.del_product = (req, res, next) => {
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
};
