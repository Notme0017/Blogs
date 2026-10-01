const { Router } = require("express");
const { isAuthenticated } = require("../middlewares/authenticateUser");
const validateComment = require("../validator/commentValidation");
const validateRequest = require("../middlewares/validateRequest");
const {requireCommentOwner, listComments, createComment, updateComment, deleteComment, requirePublishedPost} = require("../controllers/commentController");

const router = Router({mergeParams: true});

router.get("/", 
    requirePublishedPost,
    listComments
);
router.post("/", 
    isAuthenticated, 
    requirePublishedPost, 
    validateComment, 
    validateRequest, 
    createComment
);
router.put("/:commentId", 
    isAuthenticated, 
    requireCommentOwner, 
    validateComment, 
    validateRequest, 
    updateComment
);
router.delete("/:commentId", 
    isAuthenticated, 
    requireCommentOwner, 
    deleteComment
);

module.exports = router;