const express = require('express');
const cors = require('cors');
const { getTopics, getAllApi, getArticleId, getArticleidComment, getAllArticles, sendComments, getUsers, addIncreasedVotes, commentDeleted } = require('./controllers/controller');

const { forCustomErrors, forPgErrors, forServerErrors } = require('./error');


const app = express();

app.use(cors());

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getAllApi);
app.get('/api/articles/:article_id', getArticleId);
app.get('/api/articles/:article_id/comments', getArticleidComment);
app.get('/api/articles', getAllArticles);
app.post('/api/articles/:article_id/comments', sendComments);
app.get('/api/users', getUsers)
app.patch('/api/articles/:article_id', addIncreasedVotes)
app.delete('/api/comments/:comment_id', commentDeleted)

app.use(forCustomErrors);
app.use(forPgErrors);
app.use(forServerErrors);

module.exports = app;
