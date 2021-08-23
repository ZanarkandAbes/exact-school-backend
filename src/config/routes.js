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

// const billingCycleController = require('../api/controllers/billingCycleController')

// router.get('/', billingCycleController.getAll)
// router.get('/count', billingCycleController.count)
// router.get('/summary', billingCycleController.summary)
// router.post('/create', billingCycleController.create)
// router.get('/:id', billingCycleController.getById)
// router.put('/:id/update', billingCycleController.update)
// router.delete('/:id/delete', billingCycleController.delete)

// Tal controller e tais rotas: (padrão)

module.exports = router