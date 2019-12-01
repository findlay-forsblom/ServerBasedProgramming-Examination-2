const passwordHelper = {}

const MIN_LENGTH = 8

passwordHelper.checklength = (password) => {
  return password.length >= MIN_LENGTH
}

passwordHelper.checkSamePassword = (password, confirmPassword) => {
  return password === confirmPassword
}

module.exports = passwordHelper
