const express = require("express");
const userController = require("../controllers/acount.controller");
const Router = express.Router();
//add user
Router.post("/users", (req, res) => {
  userController.addUser(req, res);
});

// get all users
Router.get("/users", (req, res) => {
  console.log(req.body);
  userController.getUsers(req, res);
});
// get user by id
Router.get("/users/:id", (req, res) => {
  userController.getUserByPassportId(req, res);
});

//Deposit to user
Router.put("/deposit", (req, res) => {
    userController.depositOrWithdrowOrUpdateCredit("deposit", req, res);
});
//Withdrow from user
Router.put("/withdrow", (req, res) => {
    userController.depositOrWithdrowOrUpdateCredit("withdrow", req, res);
});
//Update user credit
Router.put("/changeCredit", (req, res) => {
    userController.depositOrWithdrowOrUpdateCredit("updateCredit", req, res);
});
//Update user credit
Router.put("/transfer", (req, res) => {
    userController.depositOrWithdrowOrUpdateCredit("transfer", req, res);
});

module.exports = Router;
