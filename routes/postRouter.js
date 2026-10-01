const {Router} = require("express");
const {isAuthenticated} = require("../middlewares/authenticateUser")
const router = Router();

const {showPublishedPosts, showAllPosts, 
    createPost, showPost, 
    updatePost, changePublishStatus, 
    deletePost, requirePostOwner
} = require("../controllers/postController");

router.get("/", showPublishedPosts);
router.get("/all", isAuthenticated, showAllPosts);//require author here

router.post("/", isAuthenticated, createPost);//require author here

router.get("/:id", showPost);

router.put("/:id", isAuthenticated, requirePostOwner, updatePost);
router.patch("/:id/publish", isAuthenticated, requirePostOwner, changePublishStatus);

router.delete("/:id", isAuthenticated, requirePostOwner, deletePost);

module.exports = router;