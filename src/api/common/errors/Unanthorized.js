class Unauthorized extends Error {
  constructor (message) {
    super(message)
    this.name = 'Unauthorized'
  }
}

module.exports = Unauthorized
