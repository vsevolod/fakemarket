-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
CREATE TABLE trades (
    id integer NOT NULL,
    pair character varying(6) NOT NULL,
    side character varying(6) NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    quantity double precision NOT NULL,
    price double precision NOT NULL,
);

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back
DROP TABLE users;
DROP SEQUENCE users_id_seq;
