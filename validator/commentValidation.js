const {body} = require("express-validator");

const validateComment = [
    body("content")
        .isString().withMessage("Comment must be text!")
        .trim()
        .notEmpty().withMessage("Comment cannot be empty!")
        .isLength({max: 2000}).withMessage("Comment is too long!"),
]

module.exports = validateComment;