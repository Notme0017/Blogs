const {Router} = require("express");
const {isAuthenticated} = require("../middlewares/authenticateUser")
const router = Router();

const {showPublishedPosts, showAllPosts, 
    createPost, showPost, 
    updatePost, changePublishStatus, 
    deletePost, requirePostOwner
} = require("../controllers/postController");
const { validateCreatePost, validateUpdatePost, validateChangePublishStatus } = require("../validator/postValidation");
const validateRequest = require("../middlewares/validateRequest");

router.get("/", showPublishedPosts);
router.get("/all", 
    isAuthenticated, 
    showAllPosts
);//require author here

router.post("/", 
    isAuthenticated, 
    validateCreatePost,
    validateRequest,
    createPost
);//require author here

router.get("/:id", showPost);

router.put("/:id", isAuthenticated, 
    validateUpdatePost,
    validateRequest,
    requirePostOwner, 
    updatePost
);
router.put("/:id/publish", 
    isAuthenticated, 
    validateChangePublishStatus,
    validateRequest,
    requirePostOwner, 
    changePublishStatus
);

router.delete("/:id", 
    isAuthenticated, 
    requirePostOwner, 
    deletePost
);

module.exports = router;