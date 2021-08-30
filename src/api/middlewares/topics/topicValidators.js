const { check, validationResult } = require('express-validator')
const Topic = require('../../models/topics')
const User = require('../../models/users')

exports.topicValidators = [
  check('userId')
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        User.findOne({ _id: req.body.userId }, function (err, user) {
          if (err) {
            reject(new Error('Server Error'))
          }
          if (!user) {
            reject(new Error(`O usuário não existe no banco de dados! Status: ${404}`))
          }
          resolve(true)

        })
      })
    }),
  check('title')
    .isLength({ min: 1, max: 100 })
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        Topic.findOne({ title: req.body.title }, function (err, topic) {
          if (err) {
            reject(new Error('Server Error'))
          }
          if (!!topic) {
            reject(new Error(`O tópico já existe no banco de dados! Status: ${409}`))
          }
          resolve(true)

        })
      })
    }),
  check('description').isLength({ min: 1, max: 500 }).notEmpty(),
  check('tags').isArray(),
  check('topicAnswers').isArray(),
  check('topicType').isString().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]