var express = require("express");
var router = express.Router();
var kmom = require("../models/reports");
var auth = require("../models/auth");

// Reports routers.


// Router get reports based on weeknr.
router.get("/:kmom", (req, res) => kmom.getReport(res, req.params.kmom));

// Add report.
router.post("/add",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => kmom.addReport(res, req.body));

//Update report.
router.put("/update",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => kmom.updateReport(res, req.body));

module.exports = router;
