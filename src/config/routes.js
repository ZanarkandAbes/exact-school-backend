// ROUTES 

const express = require('express')
const router = express.Router()

const userController = require('../api/controllers/userController')
const userValidators = require('../api/middlewares/users/userValidators')
const userTypesEnum = require('../api/common/enums/userTypes')
const userLogin = require('../api/middlewares/users/userLogin')

router.post('/login', userController.login)

router.post('/users/create', userLogin([userTypesEnum.ADMIN]), userValidators.userValidators, userController.create)
router.get('/users/', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER]), userController.getAll)
router.get('/users/count', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER]), userController.count)
router.get('/users/:id', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), userController.getById)
router.put('/users/:id/update', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), userController.update)
router.delete('/users/:id/delete', userLogin([userTypesEnum.ADMIN]), userController.delete)

const badgeController = require('../api/controllers/badgeController')
const badgeValidators = require('../api/middlewares/badges/badgeValidators')

router.post('/badges/create', userLogin([userTypesEnum.ADMIN]), badgeValidators.badgeValidators, badgeController.create)
router.get('/badges/', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), badgeController.getAll)
router.get('/badges/count', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), badgeController.count)
router.get('/badges/:id', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), badgeController.getById)
router.put('/badges/:id/update', userLogin([userTypesEnum.ADMIN]), badgeController.update)
router.delete('/badges/:id/delete', userLogin([userTypesEnum.ADMIN]), badgeController.delete)

const topicController = require('../api/controllers/topicController')
const topicValidators = require('../api/middlewares/topics/topicValidators')

router.post('/topics/create', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), topicValidators.topicValidators, topicController.create)
router.post('/topics/:id/create-topic-answers', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), topicController.createTopicAnswers)
router.get('/topics/', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), topicController.getAll)
router.get('/topics/count', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), topicController.count)
router.get('/topics/:id', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), topicController.getById)
router.put('/topics/:id/update', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), topicController.update)
router.put('/topics/:id/update-topic-answers', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), topicController.updateTopicAnswers)
router.delete('/topics/:id/delete', userLogin([userTypesEnum.ADMIN]), topicController.delete)

const classController = require('../api/controllers/classController')
const classValidators = require('../api/middlewares/classes/classValidators')

router.post('/classes/create', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER]), classValidators.classValidators, classController.create)
router.get('/classes/', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), classController.getAll)
router.get('/classes/count', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), classController.count)
router.get('/classes/:id', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), classController.getById)
router.put('/classes/:id/update', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER]), classController.update)
router.delete('/classes/:id/delete', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER]), classController.delete)

const quizController = require('../api/controllers/quizController')
const quizValidators = require('../api/middlewares/quizzes/quizValidators')

router.post('/quizzes/create', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER]), quizValidators.quizValidators, quizController.create)
router.get('/quizzes/', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), quizController.getAll)
router.get('/quizzes/count', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), quizController.count)
router.get('/quizzes/:id', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT]), quizController.getById)
router.put('/quizzes/:id/update', userLogin([userTypesEnum.ADMIN, userTypesEnum.TEACHER]), quizController.update)
router.delete('/quizzes/:id/delete', userLogin([userTypesEnum.ADMIN]), quizController.delete)

// Tal controller e tais rotas: (padrão)

module.exports = router