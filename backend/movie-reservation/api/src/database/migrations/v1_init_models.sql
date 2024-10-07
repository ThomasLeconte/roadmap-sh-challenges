CREATE TABLE IF NOT EXISTS user (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'username' VARCHAR(100) NOT NULL,
    'password' VARCHAR(255) NOT NULL,
    'email' VARCHAR(255) NOT NULL,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    'updated_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' VARCHAR(100) NOT NULL,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    'updated_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO role (name) VALUES ('USER');
INSERT INTO role (name) VALUES ('ADMIN');

CREATE TABLE IF NOT EXISTS user_role (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'user_id' INTEGER NOT NULL REFERENCES user(id),
    'role_id' INTEGER NOT NULL REFERENCES role(id),
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    'updated_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movie (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'title' VARCHAR(100) NOT NULL,
    'description' TEXT,
    'image' TEXT,
    'release_date' TIMESTAMP NOT NULL,
    'duration' INTEGER NOT NULL, -- TIMESTAMP TO ADD FOR GET EXIT SESSION TIME --
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    'updated_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movie_room (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' VARCHAR(255) NOT NULL,
    'capacity' INTEGER NOT NULL,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    'updated_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movie_session (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'movie_id' INTEGER NOT NULL REFERENCES movie(id),
    'movie_room_id' INTEGER NOT NULL REFERENCES movie_room(id),
    'start_date' TIMESTAMP NOT NULL,
    'end_date' TIMESTAMP NOT NULL,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    'updated_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS 'order' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'number' VARCHAR(100) NOT NULL,
    'movie_session_id' INTEGER NOT NULL REFERENCES movie_session(id),
    'user_id' INTEGER NOT NULL REFERENCES user(id),
    'total' DECIMAL(10, 2) NOT NULL,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    'updated_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);