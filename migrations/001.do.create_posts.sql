CREATE TABLE posts (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date_posted TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE topics (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    date_posted TIMESTAMP DEFAULT now() NOT NULL,
    topic TEXT NOT NULL
);