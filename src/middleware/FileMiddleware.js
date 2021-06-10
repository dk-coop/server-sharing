const multer = require('multer');
const path = require('path');
const { UPLOADED_ASSETS_DIR } = require('../constants');

const UploadTypeEnum = Object.freeze({
    images: 'images',
});
const AcceptedFilesEnum = Object.freeze({
    jpg: 'image/jpg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
});

const fieldSizeLimit = 64;
const filesLimit = 1; // for now. can be upped when supporting an array of files as an improvement
const fileSizeLimit = 1024 * 1024 * 10; // 10MB
const partsLimit = 100;
const headerPairsLimit = 10;

const multerOptions = {
    // for options see https://www.npmjs.com/package/multer#multeropts
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, `${UPLOADED_ASSETS_DIR}/`);
        },
        filename(req, file, cb) {
            // multer doesn't append any file extension
            const fileExt = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${Date.now()}${fileExt}`);
        },
    }),
    fileFilter(req, file, cb) {
        // check mime type and file type
        const memeCheckPassed = Object.values(AcceptedFilesEnum).includes(file.mimetype);
        const fileExtCleaned = path.extname(file.originalname).substring(1);
        const fileExtCheckPassed = Object.keys(AcceptedFilesEnum).includes(fileExtCleaned);

        if (memeCheckPassed && fileExtCheckPassed) {
            cb(null, true);
            return;
        }

        cb(new Error('Unsupported file type. only allow jpg, png, gifs.'));
    },
    limits: {
        fieldSize: fieldSizeLimit,
        files: filesLimit,
        fileSize: fileSizeLimit,
        parts: partsLimit,
        headerPairs: headerPairsLimit,
    },
};

const upload = multer(multerOptions);

function fileUploadMiddleware() {
    return upload.single(UploadTypeEnum.images);
}

module.exports = { fileUploadMiddleware };
