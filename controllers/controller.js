const { selectAllTopics, selectArticleId, selectArticleidComment, selectAllArticles, insertCommentToArticle, selectAllUsers, increaseVotes, deleteComment } = require('../models/model')
const endPoints = require('../endpoints.json')




exports.getTopics = (req, res, next) => {
    selectAllTopics().then((topics)=>{
        res.status(200).send({topics})
    }) .catch((err)=>{
        next(err)
    })
}


exports.getAllApi = (req, res) => {
    res.status(200).send({api: endPoints})
}

exports.getAllArticles = (req, res, next)=>{
    selectAllArticles()
  const { topic, sort_by, order } = req.query;
  selectAllArticles(topic, sort_by, order)
    .then((result) => {
      res.status(200).send({ articles: result });
    }).catch((err)=>{
        next(err)
    })
}

exports.getArticleId =(req, res, next) =>{
    const { article_id } = req.params
    selectArticleId(article_id)
    .then((result)=>{
        res.status(200).send({article: result})
    }).catch((err)=>{
        next(err)
    })
}

exports.getArticleidComment = (req, res, next) =>{
    const { article_id } = req.params
    selectArticleidComment(article_id).then((result)=>{
        res.status(200).send({article: result})
    }).catch((err)=>{
        next(err)
    })
}

exports.getArticleidComment = (req, res, next) =>{
    const { article_id } = req.params
    selectArticleidComment(article_id).then((result)=>{
        res.status(200).send({comments: result})
    }).catch((err)=>{
        next(err)
    })
}


  exports.sendComments = (req, res, next) =>{
    const {article_id} = req.params;
    const msg = req.body;
    insertCommentToArticle(article_id, msg).then((result)=>{
        res.status(201).send({comment: result})
    }).catch((err)=>{next(err)})
}

exports.getUsers = (req, res, next) => {
    selectAllUsers().then((users)=>{
        res.status(200).send({users})
    }) .catch((err)=>{
        next(err)
    })
}

exports.addIncreasedVotes = (req, res, next) =>{
    const {article_id} = req.params;
   
    const {incVotes} = req.body;
    increaseVotes(article_id, incVotes)
    .then((result)=>{

        res.status(200).send({article: result[0]})
    }).catch((err)=>{next(err)})
}
exports.commentDeleted = (req, res, next) =>{
    const {comment_id} = req.params

    deleteComment(comment_id)
    .then((result)=>{
        res.status(204).send({comment: result})  
    }).catch((err)=>{
        next(err)
    })
}
