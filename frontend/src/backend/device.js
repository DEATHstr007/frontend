const deviceApi = {
    getAlldevices: async () => {
      const res = await fetch("/v1/device", { method: "GET" })
      return res.json()
    },
    getdeviceByIsbn: async (deviceIsbn) => {
      const res = await fetch(`/v1/device/${deviceIsbn}`, { method: "GET" })
      return res.json()
    },
    adddevice: async (data) => {
      const res = await fetch("/v1/device", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
      return res.json()
    },
    patchdeviceByIsbn: async (deviceIsbn, data) => {
      const res = await fetch(`/v1/device/${deviceIsbn}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
      return res.json()
    },
    deletedevice: async (deviceIsbn) => {
      const res = await fetch(`/v1/device/${deviceIsbn}`, { method: "DELETE" })
      return res.json()
    },
  }
  
  module.exports = { deviceApi }