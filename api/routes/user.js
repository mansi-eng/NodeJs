const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const bcrypt = require("bcrypt");

router.post("/sign-up", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      //409/422 status is used when the data that we are adding is already present in data base / conflicts
      //201 = post/patch
      //200 = success
      if (user.length >= 1) {
        return res.status(409).json({
          messagae: "this user already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "User created",
                  data: result,
                });
              })
              .catch((err) => next()); //this will cal line number 23 of app.js //next(err) will call line number 29
          }
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res
          .status(401)
          .json({ message: "The user with this mail Id doesn't exist" });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(400).json({ Message: "auth failed" });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res
            .status(200)
            .json({ Message: "auth success", token: token });
        }
        res.status(400).json({ Message: "auth failed" });
      });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
});

router.get("/", (req, res, next) => {
  User.find()
    .exec()
    .then((data) => {
      res.status(200).json({
        data: data,
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

router.delete("/:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .exec()
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: "user not found",
        });
      } else {
        return res.status(200).json({ message: "user deleted" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
});
module.exports = router;
