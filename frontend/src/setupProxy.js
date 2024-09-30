const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080/api/',
            changeOrigin: true,
        })
    );

    app.use(
        '/oauth2/authorization/',
        createProxyMiddleware({
            target: 'http://localhost:8080/oauth2/authorization/',
            changeOrigin: true,
        })
    )
};