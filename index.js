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

//this doesn't work yet
// app.get('/questions', db.getQuestions);

app.get('/', (req, res)=>{
  res.json({info: 'Node.js, Express, and Postgres API'})
});


app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

