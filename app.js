const express = require('express')
const { getTopics, getAllApi, getAllArticles } = require('./controllers/controller')
const { forCustomErrors, forPgErrors, forServerErrors  } = require('./error')

const app = express()

app.use(express())

app.get('/api/topics', getTopics)

app.get('/api', getAllApi)

app.get('/api/articles', getAllArticles)

app.use(forCustomErrors);
app.use(forPgErrors);
app.use(forServerErrors);


module.exports = app