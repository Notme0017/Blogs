const {Router} = require("express");
const authValidators = require("../validator/authValidation");
const {signUpUser, loginUser, currentUser} = require("../controllers/authController");
const validateRequest = require("../middlewares/validateRequest");
const { isAuthenticated } = require("../middlewares/authenticateUser");
const router = Router();

router.post("/signup", 
    authValidators.validateSignUp, 
    validateRequest, 
    signUpUser);

router.post("/login", 
    authValidators.validateLogin,
    validateRequest,
    loginUser);

router.get("/me", 
    isAuthenticated,
    currentUser);

module.exports = router;