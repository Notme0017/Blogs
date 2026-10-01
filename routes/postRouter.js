const {Router} = require("express");
const {isAuthenticated} = require("../middlewares/authenticateUser")
const router = Router();

const {showPublishedPosts, showAllPosts, 
    createPost, showPost, 
    updatePost, changePublishStatus, 
    deletePost, requirePostOwner
} = require("../controllers/postController");
const { validateCreatePost, validateUpdatePost, validateChangePublishStatus } = require("../validator/postValidation");
const { validationResult } = require("express-validator");

router.get("/", showPublishedPosts);
router.get("/all", 
    isAuthenticated, 
    showAllPosts);//require author here

router.post("/", 
    isAuthenticated, 
    validateCreatePost,
    validationResult,
    createPost);//require author here

router.get("/:id", showPost);

router.put("/:id", isAuthenticated, 
    validateUpdatePost,
    validationResult,
    requirePostOwner, 
    updatePost);
router.patch("/:id/publish", 
    isAuthenticated, 
    validateChangePublishStatus,
    validationResult,
    requirePostOwner, 
    changePublishStatus);

router.delete("/:id", 
    isAuthenticated, 
    requirePostOwner, 
    deletePost);

module.exports = router;