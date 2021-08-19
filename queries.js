const moment = require('moment');

const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: '18.188.234.145',
  database: 'picassodb',
  password: 'password',
  port: 5432
})

//FIXME: ADD PAGE/COUNT FUNCTIONALITY
//TODO: OPTIMIZE RUNTIME
const getQuestions = (request, response) => {
  const q = {
    product_id: Number(request.params.product_id),
    count: request.query.count? request.query.count: 5,
    page: request.query.page? request.query.page: 1
  };
  pool.query(`
    SELECT q.product_id as "product_id",
    json_agg(
      json_build_object(
        'question_id', q.id,
        'question_body', q.body,
        'question_date', q.date_written,
        'asker_name', q.asker_name,
        'question_helpfulness', q.helpful,
        'reported', q.reported,
        'answers', answersArray
      )
    ) as "results"
  FROM questions q
  LEFT JOIN (
    SELECT
      a.question_id,
      json_agg(
        json_build_object(
          'id', a.id,
          'body', a.body,
          'date', a.date_written,
          'answerer_name', a.answerer_name,
          'helpfulness', a.helpfulness,
          'photos', ap
        )
      )answersArray
    FROM
      answers a
      LEFT JOIN (
        SELECT
          p.answer_id,
          json_agg(
            json_build_object(
              'id', p.id,
              'url', p.url
            )
          )ap
        FROM answers_photos p
        GROUP BY p.answer_id
        LIMIT 5
      ) p on a.id = p.answer_id
    GROUP BY a.question_id
    LIMIT 2
  ) a on q.id = a.question_id
  WHERE q.product_id = ${q.product_id}
  GROUP BY q.product_id
  LIMIT 1;
`, (err, res)=>{
    if(err) {
      throw err;
    }
    response.status(200).json(res.rows[0]);
  })
}

const getAnswers = (request, response) => {
  //add page and count to the
  const q = {
    question_id: Number(request.params.question_id),
    count: request.query.count? request.query.count: 5,
    page: request.query.page? request.query.page: 1
  };
  pool.query(`
  SELECT
	a.question_id,
	json_agg(
		json_build_object(
			'answer_id', a.id,
			'body', a.body,
			'date', a.date_written,
			'answerer_name', a.answerer_name,
			'helpfulness', a.helpfulness,
			'photos', ap
		)
	)answersArray
	FROM
		answers a
		LEFT JOIN (
			SELECT
				p.answer_id,
				json_agg(
					json_build_object(
						'id', p.id,
						'url', p.url
					)
				)ap
			FROM answers_photos p
			GROUP BY p.answer_id
		) p
	ON a.id = p.answer_id
    WHERE question_id = ${q.question_id}
	GROUP BY a.question_id;
`, (err, res)=>{
    if(err) {
      throw err;
    }
    response.status(200).json({
      "question": String(q.question_id),
      "page": q.page,
      "count": q.count,
      "results": res.rows[0].answersarray
    });
  })
}

const addQuestion = (request, response) => {
  pool.query('SELECT id FROM questions ORDER BY id DESC LIMIT 1;', (err, res)=>{
    if(err){
      throw err;
    }
    pool.query(
      'INSERT INTO questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);',
      [
        res.rows[0].id + 1,
        request.body.product_id,
        request.body.body,
        moment(new Date()).unix(),
        request.body.name,
        request.body.email,
        0,
        0
      ],
      (err, res)=>{
      if(err) {
        throw err;
      }
      response.status(201).send('CREATED');
    })
  });
}

const addAnswer = (request, response) => {
  pool.query('SELECT id FROM answers ORDER BY id DESC LIMIT 1;', (err, res)=>{
    let answerId = res.rows[0].id + 1;
    if(err){
      throw err;
    }
    pool.query(
      'INSERT INTO answers(id,question_id,body,date_written,answerer_name,answerer_email,reported,helpfulness) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);',
      [
        answerId,
        request.params.question_id,
        request.body.body,
        moment(new Date()).unix(),
        request.body.name,
        request.body.email,
        0,
        0
      ],
      (err, res)=>{
        if(err) {
          throw err;
        } else {
          response.status(201).send('CREATED');
          //could make this asynchronous... would be better
          //look into pg-promise async/await
          // pool.query('SELECT id FROM answers_photos ORDER BY id DESC LIMIT 1;', (err, result)=>{
          //   let photoId = result.rows[0].id;
          //   if(err){
          //     throw err;
          //   }else{
          //     request.body.photos.forEach((photo, i))=>{
          //       pool.query(
          //         'INSERT INTO answers_photos(id, answer_id, url) VALUES ($1, $2, $3);',[photoId + i + 1, answerId, photo]);
          //   }
          // })
        }
    })
  });
}

const markQuestionAsHelpful = (request, response) => {
  pool.query(
    `UPDATE questions
    SET helpful = (SELECT helpful FROM questions WHERE id = ${request.params.question_id}) + 1
    WHERE id = ${request.params.question_id}
    `,
    (err, res) => {
      if (err) {throw err};
      response.status(204).send();
    }
  )
}

const markAnswerAsHelpful = (request, response) => {
    pool.query(
    `UPDATE answers
    SET helpfulness = (SELECT helpfulness FROM answers WHERE id = ${request.params.answer_id}) + 1
    WHERE id = ${request.params.answer_id}
    `,
    (err, res) => {
      if (err) {throw err};
      response.status(204).send();
    }
  )
}

//FIX ME
const reportQuestion = (request, response) => {
    pool.query(
    `UPDATE questions
    SET helpfulness = (SELECT helpfulness FROM questions WHERE id = ${request.params.question_id}) + 1
    WHERE id = ${request.params.question_id}
    `,
    (err, res) => {
      if (err) {throw err};
      response.status(204).send();
    }
  )
}

//FIX ME
const reportAnswer = (request, response) => {
    pool.query(
    `UPDATE questions
    SET helpful = (SELECT helpful FROM questions WHERE id = ${request.params.question_id}) + 1
    WHERE id = ${request.params.question_id}
    `,
    (err, res) => {
      if (err) {throw err};
      response.status(204).send();
    }
  )
}

//DEV
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
  getAllQuestions,
  getAnswers,
  addQuestion,
  addAnswer,
  markAnswerAsHelpful,
  markQuestionAsHelpful,
  reportAnswer,
  reportQuestion
}