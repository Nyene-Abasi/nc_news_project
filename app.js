const express = require('express')
const { getTopics } = require('./controllers/controller')
const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
  } = require('./error')

const app = express()

app.use(express())

app.get('/api/topics', getTopics)




app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);




module.exports = app