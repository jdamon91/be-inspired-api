require('dotenv').config()
const { PORT, DATABASE_URL } = require('./config')

const knex = require('knex')
const app = require('./app')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})

app.set('db', db)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})