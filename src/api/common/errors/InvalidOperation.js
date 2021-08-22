class InvalidOperation extends Error {
  constructor (message) {
    super(message)
    this.name = 'InvalidOperation'
  }
}

module.exports = InvalidOperation
