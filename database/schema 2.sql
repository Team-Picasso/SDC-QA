DROP DATABASE [IF EXISTS] picassodb;

CREATE DATABASE picassodb;

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

