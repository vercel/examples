const { webcrypto } = require('node:crypto')
const Iron = require('iron-webcrypto')

const obj = {
  a: 1,
  b: 2,
  c: [3, 4, 5],
  d: {
    e: 'f'
  }
}

const password = 'a_password_having_at_least_32_chars'

const sealed = await Iron.seal(webcrypto, obj, password, Iron.defaults)
console.log({ sealed })

const unsealed = await Iron.unseal(webcrypto, sealed, password, Iron.defaults)
console.log({ unsealed })
