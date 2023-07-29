const express = require("express");
const router = express.Router();

const CheckAuth = require("../middleware/Check-Auth");
const productControllers = require("../controllers/product");

//body parser for json data
//morgon for loging request
//muter for form data parser(uploading image)
//jsonwebtoken for auth
//auth required for = product upload, product delete,adding new product

const multer = require("multer");

//const upload = multer({ dest: "uploads" });
//const upload = multer({ storage: storage });
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//we can add checks to our uploading files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("image format is incorrect"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

//localhost:8000/products/
router.get("/", productControllers.product_getALL);

//posting form data with images
router.post(
  "/",
  CheckAuth,
  upload.single("productImage"),
  productControllers.create_product
);

//localost:8000/prodcuts/productid
router.get("/:productId", productControllers.get_product);

router.patch("/:productid", CheckAuth, productControllers.update_product);

router.delete("/:productId", CheckAuth, productControllers.del_product);

module.exports = router;
