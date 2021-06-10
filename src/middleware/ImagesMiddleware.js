const { check, oneOf } = require('express-validator');
const { fileUploadMiddleware } = require('./FileMiddleware');

module.exports = {
  createImageMiddleware: [
      fileUploadMiddleware(),
      check('name')
          .trim()
          .isLength({ min: 3 })
          .withMessage('Must be at least 3 characters long')
          .isLength({ max: 30 })
          .withMessage('Must be at less than 15 characters long')
          .escape(),
      check('description')
          .isLength({ max: 50 })
          .withMessage('Must be at less than 30 characters long')
          .trim()
          .escape(),
      check('tags')
          .isLength({ max: 50 })
          .withMessage('Must be at less than 30 characters long')
          .trim()
          .escape(),
  ],
  getImagesMiddleware: [
      check('imageId')
          .isLength({ max: 50 })
          .withMessage('Must be at less than 50 characters long')
          .trim(),
  ],
  getImagesByTagsMiddleware: [
      oneOf([
          check('tagId')
              .isLength({ max: 50 })
              .withMessage('Must be at less than 50 characters long')
              .trim(),
          check('tagIds')
              .isLength({ max: 50 })
              .withMessage('Must be at less than 50 characters long')
              .trim(),
      ]),
  ],
};
