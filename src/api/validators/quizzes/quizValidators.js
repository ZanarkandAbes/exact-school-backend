const { check, validationResult } = require('express-validator')
const Quiz = require('../../models/quizzes')

exports.quizValidators = [
  check('description')
    .isLength({ min: 1, max: 500 })
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        Quiz.findOne({ description: req.body.description }, function (err, quiz) {
          if (err) {
            reject(new Error('Server Error'))
          }
          if (!!quiz) {
            reject(new Error(`A pergunta já existe no banco de dados! Status: ${409}`))
          }
          resolve(true)

        })
      })
    }),
  check('questionType').isString().notEmpty(),
  check('answer').isString().notEmpty(),
  check('coins').isFloat().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]