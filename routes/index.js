var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
    const data = {
        about: "Jag heter Charlotte Strand och bor i byn Sibbarp utanför" +
            " Tvååker i Varbergs kommun. " +
            "Min familj består av man, tre barn och en katt. Det blir inte " +
            "så mycket tid över till annat än skola och familj " +
            "men hästar och musik har alltid stått högst på listan."
    };

    res.json(data);
});

module.exports = router;
