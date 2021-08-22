// ROUTES 

const express = require('express')
const router = express.Router()

const userController = require('../api/controllers/userController')
const userValidators = require('../api/validators/users/userValidators')

router.post('/user/create', userValidators.userValidators, userController.create)
router.get('/users/', userController.getAll)

//post('/user/create', userController.create)

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