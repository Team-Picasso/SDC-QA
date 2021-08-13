const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'picasso',
  password: 'password',
  port: 5432
})

const getQuestions = (request, response) => {
  pool.query('SELECT * FROM questions', (err, res)=>{
    if(err) {
      throw err;
    }
    res.status(200).json(res.rows);
  })
}

module.exports = {
  getQuestions
}