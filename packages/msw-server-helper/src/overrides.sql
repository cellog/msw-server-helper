DROP TABLE IF EXISTS rest;

CREATE TABLE rest (
  endpointMatcher TEXT NOT NULL,
  method TEXT NOT NULL,
  handlerName TEXT NOT NULL,
  arguments TEXT,

  PRIMARY KEY (endpointMatcher, method)
);
