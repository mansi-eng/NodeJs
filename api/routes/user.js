const express = require("express");
const router = express.Router();
const chechAuth = require("../middleware/Check-Auth");
const userControllers = require("../controllers/user");

router.post("/sign-up", userControllers.user_signUp);

router.post("/login", userControllers.user_login);

router.get("/", userControllers.user_getall_user);

router.delete("/:id", chechAuth, userControllers.users_delete_user);

module.exports = router;
