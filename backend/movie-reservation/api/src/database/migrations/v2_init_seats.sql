-- database: ../db.sqlite
CREATE TABLE seat (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'code' VARCHAR(10) NOT NULL,
    'row' INTEGER NOT NULL,
    'movie_room_id' INTEGER NOT NULL REFERENCES movie_room(id),
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    'updated_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE seat_reservation (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'seat_id' INTEGER NOT NULL REFERENCES seat(id),
    'movie_session_id' INTEGER NOT NULL REFERENCES movie_session(id),
    'order_id' INTEGER NOT NULL REFERENCES 'order'(id),
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    'updated_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);