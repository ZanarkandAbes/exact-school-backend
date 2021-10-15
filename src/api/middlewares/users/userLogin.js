const jwt = require('jsonwebtoken')

const userLogin = (userPermissions) => (req, res, next) => {

  if (!!req.query.token) {
    req.body.token = req.query.token
  }

  try {
    const decode = jwt.verify(req.body.token, process.env.JWT_SECRET)
    req.authUser = decode

    if (!(userPermissions.some(userPermission => userPermission === req.authUser.userType))){
      return res.status(401).send({ success: false, res: 'Sem permissão', status: 401 })
    }
    next()
  } catch (error) {
    
    return res.status(401).send({ success: false, res: 'Falha na autenticação', status: 401 })

  }
}

module.exports = userLogin