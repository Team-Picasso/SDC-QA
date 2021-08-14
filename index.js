//index.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db = require('./queries');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get('/qa/questions', db.getQuestions);
app.get('/qa/questions/:question_id/answers', db.getAnswers);
app.post('/qa/questions', db.addQuestion);
// app.get('/allquestions', db.getAllQuestions);

app.get('/', (req, res)=>{
  res.json({info: 'Node.js, Express, and Postgres API'});
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});