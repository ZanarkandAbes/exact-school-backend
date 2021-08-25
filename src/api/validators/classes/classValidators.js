const { check, validationResult } = require('express-validator')
const Class = require('../../models/class')

exports.badgeValidators = [
  check('name')
    .isLength({ min: 1, max: 100 })
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        Badge.findOne({ name: req.body.name }, function (err, badge) {
          if (err) {
            reject(new Error('Server Error'))
          }
          if (!!badge) {
            reject(new Error(`A medalha já existe no banco de dados! Status: ${409}`))
          }
          resolve(true)

        })
      })
    }),
  check('price').isFloat().notEmpty(),
  check('badgeType').isString().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]