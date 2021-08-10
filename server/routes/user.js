const route = require("express").Router();

const { getUser } = require("../controllers/user");

route.post("/user/:email", getUser);

module.exports = route;
