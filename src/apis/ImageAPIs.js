const { ObjectID } = require('mongodb');
const { MongoClient } = require('mongodb');
const { validationResult } = require('express-validator');
const validator = require('validator');

const { DOCKER_DB_URL, ASSETS_DB, ASSETS_DB_COLLECTION_IMAGES } = require('../constants');

const { createImageMiddleware, getImagesMiddleware, getImagesByTagsMiddleware } = require('../middleware/ImagesMiddleware');

const batchImagesReturned = 10;

function validMetadata(metadataOption) {
    return validator.isAlphanumeric(metadataOption, 'en-US');
}

async function getImagesHandler(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const client = await MongoClient.connect(DOCKER_DB_URL);
        const assetsDB = client.db(ASSETS_DB);

        const filter = {};
        if (req.query) {
            if (req.query.imageId) {
                const imageObjectId = new ObjectID(req.query.imageId);
                filter._id = imageObjectId;
            }
            if (req.query.tagId) filter.tags = req.query.tagId;
            if (req.query.keyword) {
                filter.tags = { $regex: /^req.query.keyword/ };
                filter.name = { $regex: /^req.query.keyword/ };
                filter.description = { $regex: /^req.query.keyword/ };
            }
        }
        const images = await assetsDB.collection(ASSETS_DB_COLLECTION_IMAGES)
                                    .find(filter).batchSize(batchImagesReturned).toArray();
        client.close();
        res.send(images);
    } catch (error) {
        res.status(400).send('Error retrieving images with given parameters.');
        next(error);
    }
}

async function deleteImagesHandler(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const client = await MongoClient.connect(DOCKER_DB_URL);
        const assetsDB = client.db(ASSETS_DB);

        let response;
        if (req.params.imageId) {
            // delete one image from db
            const imageObjectId = new ObjectID(req.query.imageId);
            response = assetsDB.collection(ASSETS_DB_COLLECTION_IMAGES).deleteOne({ _id: imageObjectId });
        } else {
            // delete multiple images from db (would use db.collection().deleteMany)
            // not implemented yet
            response = 'Deleting multiple images is not available at this time.';
        }
        client.close();
        res.send(response);
    } catch (error) {
        res.status(400).send('Error deleting image. imageId does not exist.');
        next(error);
    }
}

async function createImagesHandler(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const description = req.body.description ? req.body.description : '';
        let tags = req.body.tags ? req.body.tags.split(',') : [];
        tags = tags.map((tag) => {
            // name and description were validated earlier in middleware
            if (!validMetadata(tag.trim())) {
                throw new Error('Names, descriptions, and individual tags are currently limited to only numbers and letters');
            }
            return tag.trim();
        });

        const client = await MongoClient.connect(DOCKER_DB_URL);
        const assetsDB = client.db(ASSETS_DB);

        const imagesDocument = {
            name: req.body.name,
            description,
            tags,
            location: req.file.path,
        };
        const results = await assetsDB.collection(ASSETS_DB_COLLECTION_IMAGES).insertOne(imagesDocument);
        client.close();

        res.send(results.ops);
    } catch (error) {
        res.status(500).send('Error adding images');
        next(error);
    }
}

function registerRoutes(app) {
    app.get('/images', getImagesHandler);
    app.get('/images/:imageId', getImagesMiddleware, getImagesHandler);
    app.get('/images/tags/:tagId', getImagesByTagsMiddleware, getImagesHandler);
    app.get('/images/keyword/:keyword', getImagesHandler);

    app.post('/images', createImageMiddleware, createImagesHandler);

    app.delete('/images/:imageId', deleteImagesHandler);
    app.post('/images/delete/:imageIds', deleteImagesHandler);
}

module.exports = { registerRoutes };
