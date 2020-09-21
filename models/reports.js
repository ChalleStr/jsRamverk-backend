const db = require("../db/database.js");

const kmom = {
    allowedFields: {
        week_nr: "weekNr",
        kmom_text: "kmomText"
    },

    dataFields:
        "ROWID as id, weekNr as week_nr, kmomText as kmom_text",

    getKmom: function(res, weekNr) {
        if (Number.isInteger(parsInt(weekNr))) {
            db.get(`SELECT ${kmom.dataFields} FROM kmom WHERE weekNr = ?`)
        }
        res.
    }
}
