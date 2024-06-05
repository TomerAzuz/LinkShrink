create sequence users_id_seq start 2 increment 1;

-- users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    reset_code VARCHAR(255),
    reset_code_verified BOOLEAN,
    is_active BOOLEAN,
    activation_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX email_index ON users (email);

-- user_role table
CREATE TABLE user_role (
    user_id BIGINT NOT NULL,
    roles VARCHAR(255) NOT NULL
);

-- url_mapping table
CREATE TABLE url_mapping (
    id BIGINT PRIMARY KEY,
    long_url VARCHAR(2048) NOT NULL,
    short_code VARCHAR(6) NOT NULL UNIQUE,
    qr_code_data TEXT,
    expiration_date TIMESTAMP NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255)
);

CREATE UNIQUE INDEX short_code_index ON url_mapping (short_code);
CREATE INDEX created_by_index ON url_mapping (created_by);

-- analytics table
CREATE TABLE analytics (
    id BIGINT PRIMARY KEY,
    url_mapping_id BIGINT NOT NULL,
    access_time TIMESTAMP,
    country VARCHAR(255),
    device_type VARCHAR(255),
    browser VARCHAR(255),
    FOREIGN KEY (url_mapping_id) REFERENCES url_mapping(id) ON DELETE CASCADE
);

CREATE INDEX url_mapping_id_index ON analytics (url_mapping_id);

