// M - MODEL

const mongoose = require('mongoose')
const quizTypesEnum = require('../common/enums/quizTypes')

const quizzesSchema = new mongoose.Schema({
  description: { type: String, min: 1, max: 500, required: [true, 'Informe a descrição!'] },
  questionType: { type: String, uppercase: true, enum: [quizTypesEnum.MULTIPLE_CHOICE], required: [true, 'Informe o tipo de medalha!'] },
  answer: { type: String, required: [true, 'Informe a resposta!'] },
  coins: { type: Number, min: 1, required: [true, 'Informe as moedas!'], default: 0 },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
}, { collection: 'quizzes' })

module.exports = mongoose.model('Quizzes', quizzesSchema)