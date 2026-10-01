const {body} = require("express-validator");

validateCreatePost = [
    body("title")
        .isString().withMessage("Title must be text!")
        .trim()
        .notEmpty().withMessage("Title cannot be null!")
        .isLength({max: 255}).withMessage("Title is too long!"),

    body("content")
        .isString().withMessage("Content can only be text!")
        .notEmpty().withMessage("Content cannot be empty!")
        .isLength({max: 50000}).withMessage("Content is too long!"),

    body("published")
        .optional()
        .isBoolean().withMessage("Published must be true or false!")
        .toBoolean(),
]

validateUpdatePost = [
    body("title")
        .isString().withMessage("Title must be text!")
        .trim()
        .notEmpty().withMessage("Title cannot be empty!")
        .isLength({max: 255}).withMessage("Title is too long!"),
        
    body("content")
        .isString().withMessage("Content can only be text!")
        .notEmpty().withMessage("Content cannot be empty!")
        .isLength({max: 50000}).withMessage("Content is too long!"),
]

validateChangePublishStatus = [
    body("publishStatus")
        .isBoolean().withMessage("Publish status must be true or false!")
        .toBoolean(),
]

module.exports = {
    validateCreatePost,
    validateUpdatePost,
    validateChangePublishStatus
}