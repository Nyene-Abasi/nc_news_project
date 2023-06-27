const { selectAllTopics } = require('../models/model')
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

