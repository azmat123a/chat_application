// routes/user.routes.js
const express = require("express");
const userController = require("../../_controller/users/users");

const router = express.Router();

router.get("/search", userController.searchUser);
router.get("/user", userController.getUserByJWT);
router.get("/logout", userController.logoutUser)
router.get("/:uid", userController.getUserByUid);

router.post("/", userController.postUser);

router.put("/:userId/status",userController.updateUserStatus);



module.exports = router;
