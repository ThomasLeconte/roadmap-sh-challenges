CREATE TABLE IF NOT EXISTS CATEGORY (
    'id' SERIAL PRIMARY KEY,
    'code' VARCHAR(10) NOT NULL,
    'name' VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS EXPENSE (
    'id' SERIAL PRIMARY KEY,
    'category_id' INT NOT NULL,
    'user_id' INT NOT NULL,
    'amount' DECIMAL(10, 2) NOT NULL,
    'description' TEXT,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    'updated_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES CATEGORY (id),
    FOREIGN KEY (user_id) REFERENCES "USER" (id)
);

INSERT INTO CATEGORY (code, name) VALUES
('FOOD', 'Groceries'),
('LEISURE', 'Leisure'),
('ELEC', 'Electronics'),
('UTILITIES', 'Utilities'),
('CLOTHING', 'Clothing'),
('HEALTH', 'Health'),
('OTHERS', 'Others');
