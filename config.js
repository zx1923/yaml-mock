const helper = require("./src/utils/helper")

module.exports = {
  http: {
    port: 8080,
    enabledMethods: [
      'get',
      'post',
      'put',
      'delete',
      'options'
    ]
  },
  services: [
    'user-order'
  ],
}