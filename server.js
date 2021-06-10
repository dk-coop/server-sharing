#!/path/to/node
const express = require('express');
const cors = require('cors');
const path = require('path');

const routes = require('./routes');
const { UPLOADED_ASSETS_DIR } = require('./src/constants');

const app = express();

app.use(cors());
app.options('*', cors());

app.use('/', routes(app));

// middleware that only parses json
app.use(express.json());

// front-end and assets storage location
app.use(express.static(path.join(__dirname, './client/build')));
app.use(express.static(path.join(__dirname, `./${UPLOADED_ASSETS_DIR}`)));

const server = app.listen(3000, () => {
    console.info(`Server is listening on port ${server.address().port}`);
});

app.use(function (err, req, res, next) {
    res.status(500).send(err.message)
  })