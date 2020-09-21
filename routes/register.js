const express = require("express");
const router = express.Router();
const auth = require("../models/auth");


// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:1337/"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

router.post("/", (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);

    auth.register(req, res);
});

module.exports = router;
