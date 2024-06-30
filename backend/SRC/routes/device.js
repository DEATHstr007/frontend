const router = require("express")()
const { deviceModel } = require("../models/device")
router.get("/", async (req, res, next) => {
  try {
    const devices = await deviceModel.find({})
    return res.status(200).json({
      devices: devices.map((device) => ({
        ...device.toJSON(),
        availableQuantity: device.quantity - device.borrowedBy.length,
      })),
    })
  } catch (err) {
    next(err)
  }
})
router.get("/:deviceIsbn", async (req, res, next) => {
  try {
    const device = await deviceModel.findOne({ isbn: req.params.deviceIsbn })
    if (device == null) {
      return res.status(404).json({ error: "device not found" })
    }
    return res.status(200).json({
      device: {
        ...device.toJSON(),
        availableQuantity: device.quantity - device.borrowedBy.length,
      },
    })
  } catch (err) {
    next(err)
  }
})
router.post("/", async (req, res, next) => {
  try {
    const device = await deviceModel.findOne({ isbn: req.body.isbn })
    if (device != null) {
      return res.status(400).json({ error: "device with same ISBN already found" })
    }
    const newdevice = await deviceModel.create(req.body)
    return res.status(200).json({ device: newdevice })
  } catch (err) {
    next(err)
  }
})
router.patch("/:deviceIsbn", async (req, res, next) => {
  try {
    const device = await deviceModel.findOne({ isbn: req.params.deviceIsbn })
    if (device == null) {
      return res.status(404).json({ error: "device not found" })
    }
    const { _id, isbn, ...rest } = req.body
    const updateddevice = await device.update(rest)
    return res.status(200).json({ device: updateddevice })
  } catch (err) {
    next(err)
  }
})
router.delete("/:deviceIsbn", async (req, res, next) => {
  try {
    const device = await deviceModel.findOne({ isbn: req.params.deviceIsbn })
    if (device == null) {
      return res.status(404).json({ error: "device not found" })
    }
    await device.delete()
    return res.status(200).json({ success: true })
  } catch (err) {
    next(err)
  }
})
module.exports = { router }