const commentQueries = require("../db/comment.query");
const postQueries = require("../db/post.query");

const getPagination = function(query){
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 50);
    const skip = (page - 1)* limit;
    return {page, limit, skip};
};

exports.requirePublishedPost = async (req, res, next) => {
  try {
    const post = await postQueries.getPublishedPostById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found!" });
    next();
  } catch (err) {
    next(err);
  }
};

exports.requireCommentOwner = async(req, res, next) =>{
    try{
        const comment = await commentQueries.getCommentByCommentId(req.params.commentId);
        
        if(!comment || comment.post.id !== req.params.postId) 
            return res.status(404).json({error: "Comment not found!"});
        
        if(comment.user.id !== req.user.id)
            return res.status(403).json({error: "Unauthorized access!"});
        next();
    }catch(err){
        next(err);
    };
};

exports.listComments = async(req, res, next) =>{
    try{
        const {page, limit, skip} = getPagination(req.query);
        const postId = req.params.postId;

        const comments = await commentQueries.getAllCommentsByPostId(postId, skip, limit);
        const totalComments = await commentQueries.getTotalCommentCountByPostId(postId);

        return res.status(200).json({
            data: comments,
            pagination: {
                totalItems: totalComments,
                totalPages: Math.ceil(totalComments/limit),
                currentPage: page,
                pageSize: limit,
            },
        });
    }catch(err){
        next(err);
    }
};

exports.createComment = async(req, res, next) =>{
    try{
        const postId = req.params.postId;
        const {content} = req.body;

        const comment = await commentQueries.createComment(content, req.user.id, postId);
        return res.status(201).json(comment);
    }catch(err){
        next(err);
    }
};

exports.updateComment = async(req, res, next) =>{
    try {
        const {commentId} = req.params;
        const {content} = req.body;
    
        const updatedComment = await commentQueries.updateComment(commentId, content);
        return res.status(200).json(updatedComment);
    } catch (error) {
        next(error);
    };
};

exports.deleteComment = async(req, res, next) =>{
    try{
        const commentId = req.params.commentId;
        await commentQueries.deleteComment(commentId);
        return res.status(204).send();
    }catch(err){
        next(err);
    }
}