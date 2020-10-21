const sqlite3 = require("sqlite3").verbose();

module.exports = (function () {
    if (process.env.NODE_ENV === "test") {
        return new sqlite3.Database("/tests.sqlite");
    }

    return new sqlite3.Database("./db/users.sqlite");
})();
//const db = new sqlite3.Database("/texts.sqlite");

// db.run("INSERT INTO users (email, password) VALUES (?, ?)",
//     "user@example.com",
//     "superlongpassword", (err) => {
//     if (err) {
//         console.log("Nu blev det visst fel.");
//     }
//     console.log("Användaren är skapad.");
// });
//
// db.run("INSERT INTO kmom (week_nr, kmom_text) VALUES (?, ?)",
//     1,
//     "README.md", (err) => {
//     if (err) {
//         console.log("Det här kursmomentet finns redan.");
//     }
//     console.log("Kursmomentet är inlagt!")
// })
