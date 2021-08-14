const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'amaliabryant',
  host: 'localhost',
  database: 'picassodb',
  password: 'password',
  port: 5432
})

const getQuestions = (request, response) => {
  const q = {
    product_id: request.query.product_id,
    count: request.query.count? request.query.count: 5,
    page: request.query.page? request.query.page: 1
  };
  pool.query(`
    select *
    from   questions
    where  product_id = ${q.product_id} and reported = 0
    limit  ${q.count}
    offset ${((q.page * q.count) - q.count)}
`, (err, res)=>{
    if(err) {
      throw err;
    }
    response.status(200).json({
      "product_id": String(q.product_id),
      "results": res.rows
    });
  })
}

const getAnswers = (request, response) => {
  const q = {
    question_id: Number(request.params.question_id),
    count: request.query.count? request.query.count: 5,
    page: request.query.page? request.query.page: 1
  }

  pool.query(`
    select *
    from   answers
    where  question_id = ${q.question_id} and reported = 0
    limit  ${q.count}
    offset ${((q.page * q.count) - q.count)}
`, (err, res)=>{
    if(err) {
      throw err;
    }
    response.status(200).json({
      "question": String(q.question_id),
      "page": q.page,
      "count": q.count,
      "results": res.rows
    });
  })
}

const addQuestion = (request, response) => {
  //FIX ME!!! THE DATE IS EPOCH TIME
  const q = request.query;
  pool.query(`
    INSERT INTO questions(product_id, body, date_written, asker_name, asker_email, reported, helpful)
    VALUES (),
`, (err, res)=>{
    if(err) {
      throw err;
    }
    response.status(200).json(res.rows);
  })
}

const getAllQuestions = (request, response) => {
  const q = request.query;
  pool.query(`
    select *
    from   questions
    where  product_id = ${q.product_id}
`, (err, res)=>{
    if(err) {
      throw err;
    }
    response.status(200).json(res.rows);
  })
}

module.exports = {
  getQuestions,
  // getAllQuestions,
  getAnswers,
  addQuestion
}