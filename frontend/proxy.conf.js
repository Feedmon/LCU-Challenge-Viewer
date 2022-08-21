const PROXY_CONFIG = [
  {
    context: [
      "/api"
    ],
    target: "http://localhost:8080",
    secure: false,
    bypass: function (req, res, proxyOptions) {
      req.headers["x-forwarded-for"] = req.socket.remoteAddress
    }
  }
]

module.exports = PROXY_CONFIG
