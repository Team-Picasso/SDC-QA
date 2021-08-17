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

//get
app.get('/qa/questions/:product_id', db.getQuestions);
app.get('/qa/questions/:question_id/answers', db.getAnswers);

//post
app.post('/qa/questions/:question_id/answers', db.addAnswer);
app.post('/qa/questions', db.addQuestion);

//put
app.put('/qa/questions/:question_id/helpful', db.markQuestionAsHelpful);
app.put('/qa/questions/:question_id/report', db.reportQuestion);

app.put('/qa/answers/:answer_id/helpful', db.markAnswerAsHelpful);
app.put('/qa/answers/:answer_id/report', db.reportAnswer);

//dev
app.get('/qa/allquestions', db.getAllQuestions);

app.get('/', (req, res)=>{
  res.json({info: 'Node.js, Express, and Postgres API'});
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});