
/*
start postgres in terminal: psql postgres
run sql file: \i db/schema.sql
switch database: \c picassodb
look at table information: \dt+
*/
\c postgres;
DROP DATABASE IF EXISTS picassodb;

CREATE DATABASE picassodb;
\c picassodb;

/* Table 'questions' */
CREATE TABLE questions (
id integer NOT NULL,
product_id integer NOT NULL,
body text NOT NULL,
date_written bigint NOT NULL,
asker_name text NOT NULL,
asker_email text NOT NULL,
reported integer NOT NULL,
helpful integer NOT NULL,
PRIMARY KEY(id));

/* Table 'answers' */
CREATE TABLE answers (
id integer NOT NULL,
question_id integer NOT NULL,
body text NOT NULL,
date_written bigint NOT NULL,
answerer_name text NOT NULL,
answerer_email text NOT NULL,
reported integer,
helpfulness integer,
PRIMARY KEY(id));

/* Table 'answers_photos' */
CREATE TABLE answers_photos (
id integer NOT NULL,
answer_id integer NOT NULL,
url text NOT NULL,
PRIMARY KEY(id));

/* Relation 'questions-answers' */
ALTER TABLE answers ADD CONSTRAINT "questions-answers"
FOREIGN KEY (question_id)
REFERENCES questions(id);

/* Relation 'answers-answers_photos' */
ALTER TABLE answers_photos ADD CONSTRAINT "answers-answers_photos"
FOREIGN KEY (answer_id)
REFERENCES answers(id);

-- https://www.postgresqltutorial.com/import-csv-file-into-posgresql-table/
-- COPY persons(first_name, last_name, dob, email)
-- FROM 'C:\sampledb\persons.csv'
-- DELIMITER ','
-- CSV HEADER;

/*absolute paths:
/Users/amaliabryant/Documents/HackReactor/SDC/seed/answers_photos.csv
/Users/amaliabryant/Documents/HackReactor/SDC/seed/answers.csv
/Users/amaliabryant/Documents/HackReactor/SDC/seed/questions.csv
*/

COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
FROM '/Users/amaliabryant/Documents/HackReactor/SDC/seed/questions.csv'
DELIMITER ','
CSV HEADER;

COPY answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpfulness)
FROM '/Users/amaliabryant/Documents/HackReactor/SDC/seed/answers.csv'
DELIMITER ','
CSV HEADER;

COPY answers_photos(id, answer_id, url)
FROM '/Users/amaliabryant/Documents/HackReactor/SDC/seed/answers_photos.csv'
DELIMITER ','
CSV HEADER;
