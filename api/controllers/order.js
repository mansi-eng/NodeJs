const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((data) => {
      const response = {
        count: data.length,
        products: data.map((item) => {
          return {
            product: item.product,
            quantity: item.quantity,
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

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.product)
    .then((data) => {
      if (!data) {
        return res.status(400).json({
          message: "product not found",
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.product,
      });
      return order.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.orders_delete_order = (req, res, next) => {
  const id = req.params.orderid;
  Order.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: "order not found",
        });
      }
      res.status(200).json({
        message: "order deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
