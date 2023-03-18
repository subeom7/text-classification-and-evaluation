const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    ['/classify', '/result'],
    createProxyMiddleware({
      target: 'http://localhost:5002',
      changeOrigin: true,
    })
  );
};