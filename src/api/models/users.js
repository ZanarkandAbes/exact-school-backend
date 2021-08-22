// M - MODEL

const mongoose = require('mongoose')
const userTypesEnum = require('../common/enums/userTypes')

const userDataSchema = new mongoose.Schema({
  email: { type: String, required: [true, 'Informe o email!'] },
  password: { type: String, min: 1, max: 30, required: [true, 'Informe a senha!'] },
  name: { type: String, min: 2, max: 100, required: [true, 'Informe o nome!'] },
  birthDay: { type: Date, required: [true, 'Informe a data de nascimento!'] },
  userType: { type: String, uppercase: true, enum: [userTypesEnum.ADMIN, userTypesEnum.TEACHER, userTypesEnum.STUDENT], required: [true, 'Informe o tipo de usuário!'] },
  badges: { type: Array, default: [], required: false },
  totalCoins: { type: Number, min: 0, required: false, default: 0 },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
}, { collection: 'user_data' })

module.exports = mongoose.model('UserData', userDataSchema)