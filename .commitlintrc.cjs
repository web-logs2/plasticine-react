const { readdirSync } = require('fs')
const { resolve } = require('path')

const packages = readdirSync(resolve(__dirname, 'packages'))
const playgrounds = readdirSync(resolve(__dirname, 'playgrounds')).map((item) => `playground/${item}`)

/**
 * @type { import('cz-git').UserConfig }
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [2, 'never', ['upper-case']],
  },
  prompt: {
    scopes: [...packages, ...playgrounds],
  },
}
