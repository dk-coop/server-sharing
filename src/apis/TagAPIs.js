const { MongoClient } = require('mongodb');
const { DOCKER_DB_URL, ASSETS_DB, ASSETS_DB_COLLECTION_IMAGES } = require('../constants');

async function getTagsHandler(req, res, next) {
    try {
        const client = await MongoClient.connect(DOCKER_DB_URL);
        const assetsDB = client.db(ASSETS_DB);
        const tags = await assetsDB.collection(ASSETS_DB_COLLECTION_IMAGES).distinct("tags");
        client.close();
        res.send(tags);
    } catch (error) {
        res.status(400).send("Error fetching tags from db");
        next(error);
    }
}

function registerRoutes(app) {
    app.get('/tags', getTagsHandler);
}

module.exports = { registerRoutes };