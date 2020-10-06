const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/kmom.sqlite");

const kmom = {

    getReport: function(res, kmom, status=200) {
        db.get("SELECT * FROM kmom WHERE week_nr = ?",
        kmom,
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/reports/week/" + kmom,
                        title: "Database error",
                        detail: err.message
                    }
                });
            }
            res.status(status).json( { data: row} );
        });
    },

    addReport: (res, body) => {
        const weekNr = body.week_nr;
        const kmomText = body.kmom_text;

        db.get("SELECT * FROM kmom WHERE week_nr = ?",
            weekNr,
            (err, rows) => {
                console.log(rows);
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/add",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }
                if (rows !== undefined) {
                    return res.status(409).json({
                        errors: {
                            status: 409,
                            source: "/add",
                            title: "WeekNr already exists.",
                            detail: "WeekNr already exists.Please choose another week."
                        }
                    });
                } else {
                    db.run("INSERT INTO kmom (week_nr, kmom_text) VALUES (?, ?);",
                        weekNr,
                        kmomText,
                        (err) => {
                            if (err) {
                                return res.status(500).json({
                                    errors: {
                                        status: 500,
                                        source: "/add",
                                        title: "Database error",
                                        detail: err.message
                                    }
                                });
                            }

                            return res.status(201).json({
                                data: {
                                    message: "Report added."
                                }
                            });
                        });
                }
            });
    },


    updateReport: (res, body) => {
        const weekNr = body.week_nr;
        const kmomText = body.kmom_text;
        console.log(weekNr);
        console.log(kmomText);

        db.run("UPDATE kmom SET kmom_text = ? WHERE week_nr = ?",
            kmomText,
            weekNr,
            (err) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "PUT /update",
                            detail: err.message
                        }
                    });
                }

                return res.json({
                    data: {
                        message: "Updated!"
                    }
                });
            });
    }
};

module.exports = kmom;
