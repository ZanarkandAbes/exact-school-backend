// ROUTES 

const express = require('express')
const router = express.Router()

const userController = require('../api/controllers/userController')
const userValidators = require('../api/validators/users/userValidators')

router.post('/users/create', userValidators.userValidators, userController.create)
router.get('/users/', userController.getAll)
router.get('/users/count', userController.count)
router.get('/users/:id', userController.getById)
router.put('/users/:id/update', userController.update)
router.delete('/users/:id/delete', userController.delete)

const badgeController = require('../api/controllers/badgeController')
const badgeValidators = require('../api/validators/badges/badgeValidators')

router.post('/badges/create', badgeValidators.badgeValidators, badgeController.create)
router.get('/badges/', badgeController.getAll)
router.get('/badges/count', badgeController.count)
router.get('/badges/:id', badgeController.getById)
router.put('/badges/:id/update', badgeController.update)
router.delete('/badges/:id/delete', badgeController.delete)

const topicController = require('../api/controllers/topicController')
const topicValidators = require('../api/validators/topics/topicValidators')

router.post('/topics/create', topicValidators.topicValidators, topicController.create)
router.get('/topics/', topicController.getAll)
router.get('/topics/count', topicController.count)
router.get('/topics/:id', topicController.getById)
router.put('/topics/:id/update', topicController.update)
router.delete('/topics/:id/delete', topicController.delete)

// Tal controller e tais rotas: (padrão)

module.exports = router