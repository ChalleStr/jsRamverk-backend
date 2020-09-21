CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS kmom (
    week_nr INT NOT NULL,
    kmom_text VARCHAR,
    UNIQUE(week_nr)
);
