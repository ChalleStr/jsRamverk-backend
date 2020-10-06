const express = require("express");
const router = express.Router();
const auth = require("../models/auth");

router.post("/", (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);

    auth.register(req, res);
});

module.exports = router;
