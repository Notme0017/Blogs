const {body} = require("express-validator");
const userQueries = require("../db/user.query");

validateSignUp = [
    body("username")
        .isString().withMessage("Username must be text!")
        .trim()
        .notEmpty().withMessage("Username is required!")
        .isLength({max: 100}).withMessage("Username is too long!")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers and underscore.")
        .custom( async (value) =>{
            const exists = await userQueries.findUserByUsername(value);
            if(exists) throw new Error("Username already taken!");
        }),



    body("password")
        .isString().withMessage("Password must be text!")
        .notEmpty().withMessage("Password cannot be empty")
        .isLength({min: 8, max: 100}).withMessage("Password must be between 8 and 100 characters!")
        .matches(/\d/).withMessage("Password must contain at least one digit.")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase character.")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase character.")
        .matches(/[@$!%!*?&]/).withMessage("Password must contain at least one special character.")
];

validateAuthorSignUp = [
     body("username")
        .isString().withMessage("Username must be text!")
        .trim()
        .notEmpty().withMessage("Username is required!")
        .isLength({max: 100}).withMessage("Username is too long!")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers and underscore.")
        .custom( async (value) =>{
            const exists = await userQueries.findUserByUsername(value);
            if(exists) throw new Error("Username already taken!");
        }),



    body("password")
        .isString().withMessage("Password must be text!")
        .notEmpty().withMessage("Password cannot be empty")
        .isLength({min: 8, max: 100}).withMessage("Password must be between 8 and 100 characters!")
        .matches(/\d/).withMessage("Password must contain at least one digit.")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase character.")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase character.")
        .matches(/[@$!%!*?&]/).withMessage("Password must contain at least one special character."),

    body("isAuthor")
        .optional()
        .isBoolean().withMessage("Are you author or not?")
        .toBoolean(),
]

validateLogin = [
    body("username")
        .isString().withMessage("Username must be a string!")
        .trim()
        .notEmpty().withMessage("Username is required!"),

    body("password")
        .isString().withMessage("Password must be a string!")
        .notEmpty().withMessage("Password is required!"),
]


module.exports = {validateSignUp, validateLogin, validateAuthorSignUp};