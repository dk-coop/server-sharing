const path = require('path');
const express = require('express');
const { UPLOADED_ASSETS_DIR } = require('./src/constants');
const { ImageAPIs, TagAPIs } = require('./src/apis/index');

function routes(app) {
    const router = express.Router();

    router.get('/health', (req, res, next) => {
        res.send('Server is healthy');
        next();
    });

    // add routes for images and tags
    ImageAPIs.registerRoutes(app);
    TagAPIs.registerRoutes(app);

    // access react front-end
    router.get('/', (req, res) => res.sendFile(path.resolve('./client/build/index.html')));

    // access uploaded images on server
    router.get(`/${UPLOADED_ASSETS_DIR}/:assetId`, (req, res) => res.sendFile(path.resolve(`./${UPLOADED_ASSETS_DIR}/`, req.params.assetId)));

    return router;
}

module.exports = routes;
