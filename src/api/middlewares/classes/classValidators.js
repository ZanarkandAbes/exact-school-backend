const { check, validationResult } = require('express-validator')
const validateYouTubeUrl = require('../../common/utils/validateYoutubeUrl')

const Class = require('../../models/classes')
const Topic = require('../../models/topics')
const User = require('../../models/users')

exports.classValidators = [
  check('topicId')
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        Topic.findOne({ _id: req.body.topicId === '' ? null : req.body.topicId }, function (err, topic) {
          if (err) {
            reject(new Error('Server Error'))
          }
          if (!topic && req.body.topicId !== '') {
            reject(new Error(`O tópico não existe no banco de dados! Status: ${404}`))
          }
          resolve(true)

        })
      })
    }),
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
        Class.findOne({ title: req.body.title }, function (err, classToFind) {
          if (err) {
            reject(new Error('Server Error'))
          }
          if (!!classToFind) {
            reject(new Error(`A aula já existe no banco de dados! Status: ${409}`))
          }
          resolve(true)

        })
      })
    }),
  check('videoUrl')
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {

        if (!validateYouTubeUrl(req.body.videoUrl)) {
          reject(new Error(`A url do vídeo do youtube está inválida! Status: ${400}`))
        }

        resolve(true)
      })
    }),
  check('classType').isString().notEmpty(),
  check('quizzes').isArray(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]