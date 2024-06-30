const { device } = require("../components/device/device")
const { deviceApi } = require("./device")
const { UserApi } = require("./user")

const BackendApi = {
  device: deviceApi,
  user: UserApi,
}

module.exports = { BackendApi }