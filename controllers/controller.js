const { selectAllTopics } = require('../models/model')

exports.getTopics = (req, res, next) => {
    selectAllTopics().then((topics)=>{
        res.status(200).send({topics})
    }) .catch((err) => {
            if (err.code === '42704') {
              res.status(404).send({ msg: 'Not Found' });
            } else {
              res.status(500).send({ msg: 'Internal Server Error' });
            }    
      });
}
