// C - CONTROLLER

// as operações de manipulação estão dentro do User (pois ele é um modelo do mongoose que está no outro arquivo)
// para validar senha bcrypt.compareSync(passwordToCompare, passwordOfDatabase) quando for logar e fazer autenticação

const User = require('../models/users')

const bcrypt = require('bcrypt')

exports.create = function (req, res, next) {

  const salt = bcrypt.genSaltSync(10)
  const encryptedHashPassword = bcrypt.hashSync(req.body.password, salt)

  let user = new User({
    email: req.body.email,
    password: encryptedHashPassword,
    name: req.body.name,
    birthDay: req.body.birthDay,
    userType: req.body.userType,
    badges: req.body.badges,
    totalCoins: req.body.totalCoins,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  user.save(function (err, userCreated) {
    if (err) {
      res.status(500).send({ errors: [err] })
      next()
    }
    res.send({ success: true, res: 'Usuário cadastrado com sucesso!' })
  })
}


exports.getAll = function (req, res, next) {

  let filters = {}, emailToFilter, nameToFilter

  if (!!req.query.email) {
    emailToFilter = req.query.email ? req.query.email : ''
    filters.email = {
      $regex: '.*' + emailToFilter + '.*'
    }
  }

  if (!!req.query.name) {
    nameToFilter = req.query.name ? req.query.name : ''
    filters.name = {
      $regex: '.*' + nameToFilter + '.*'
    }
  }

  console.log(filters)

  User.find(filters, function (err, users) {
    if (err) {
      res.status(500).json({ errors: [err] })
      next()
    }
    res.send(users)
  }).limit(req.query.limit).skip(req.query.skip)
}

exports.getById = function (req, res, next) {
  BillingCycle.findById(req.params.id, function (err, billingCycle) {
    if (err) res.status(500).json({ errors: [err] })
    if (!billingCycle) {
      const error = new NotFoundError()
      error.httpStatusCode = 404
      res.status(error.httpStatusCode).json(`Ciclo de pagamento não encontrado, erro: ${error.httpStatusCode}`)
      return next(error)
    }

    res.send(billingCycle)
  })
}


exports.update = function (req, res, next) {
  BillingCycle.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, billingCycle) {
    if (err) res.status(500).json({ errors: [error] })
    if (!billingCycle) res.send('Clico de pagamento não existe')
    BillingCycle.findById(req.params.id, function (err, billingCycle) {
      res.send(billingCycle)
    })
    // res.send('Ciclo de pagamento atualizado com sucesso!')
  })
}

exports.delete = function (req, res, next) {
  BillingCycle.findByIdAndRemove(req.params.id, function (err, billingCycle) {
    if (err) res.status(500).json({ errors: [error] })
    if (!billingCycle) res.send('Ciclo de pagamento não existe')
    res.send('Ciclo de pagamento apagado com sucesso!')
  })
}

exports.count = function (req, res, next) {
  BillingCycle.count({}, function (err, value) {
    if (err) res.status(500).json({ errors: [error] })
    if (!value) res.send('Não existem ciclos de pagamento para serem contabilizados')
    res.json({ value })
  })
}

exports.summary = function (req, res, next) {
  BillingCycle.aggregate({
    $project: { credit: { $sum: "$credits.value" }, debt: { $sum: "$debts.value" } }
  }, {
    $group: {
      _id: null,
      credit: { $sum: "$credit" }, // $credit referência que saiu do $project | credit novo atributo
      debt: { $sum: "$debt" }
    }
  }, {
    $project: {
      _id: 0,
      credit: 1,
      debt: 1
    }
  }, (err, result) => {
    if (err) {
      res.status(500).json({ errors: [error] })
    }
    res.json(result[0] || { credit: 0, debt: 0 })
  })
}
