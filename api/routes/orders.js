const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/Check-Auth");
const orderControllers = require("../controllers/order");

//localhost:8000/orders
router.get("/", checkAuth, orderControllers.orders_get_all);

router.post("/", checkAuth, orderControllers.orders_create_order);

router.delete("/:orderid", checkAuth, orderControllers.orders_delete_order);

module.exports = router;
