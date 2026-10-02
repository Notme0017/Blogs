const postQueries = require("../db/post.query");

function getPagination(query){
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 50);
    const skip = (page - 1) * limit;
    return {page, limit, skip}; 
}

exports.requirePostOwner = async(req, res, next) =>{
    try {
        const post = await postQueries.getUserIdByPostId(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found!" });
        if (post.user.id !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized access!" });
        }
        next();
  } catch (err) {
        next(err);
  }
}

exports.showPublishedPosts = async (req, res, next) =>{
    try{
        const {page, limit, skip} = getPagination(req.query);

        const posts = await postQueries.getAllPublishedPost(skip, limit);
        const totalPosts = await postQueries.getPublishedPostCount();

        res.status(200).json({
            data: posts,
            pagination: {
                totalItems: totalPosts,
                totalPages: Math.ceil(totalPosts/limit),
                currentPage: page,
                pageSize: limit,
            },
        });
    }catch(err){
        next(err);
    };
};

exports.showAllPosts = async (req, res, next) =>{
    try{
        const {page, limit, skip} = getPagination(req.query);
        const userId = req.user.id;
        const posts = await postQueries.getAllPost(userId, skip, limit);
        const totalPosts = await postQueries.getAllPostCount(userId);
    
        res.status(200).json({
            data: posts,
            pagination: {
                totalItems: totalPosts,
                totalPages: Math.ceil(totalPosts/limit),
                currentPage: page,
                pageSize: limit,
            },
        });
    }catch(err){
        next(err);
    };
};

exports.createPost = async (req, res, next) =>{
    try{
        const{title, content} = req.body;
        const userId = req.user.id;

        const post = await postQueries.createPost(title, content, userId);
    
        return res.status(201).json(post);
    }catch(err){
        next(err);
    }
};

exports.showPost = async (req, res, next) =>{
    try{
        const postId = req.params.id;
        const post = await postQueries.getPublishedPostById(postId);

        if(!post) return res.status(404).json({
            error: "Post not found!",
        });

        return res.status(200).json(post);
    }catch(err){
        next(err);
    }
};

exports.showPostForAuthor = async (req, res, next) =>{
    try{
        const postId = req.params.id;
        const post = await postQueries.getPostById(postId);

        if(!post) return res.status(404).json({
            error: "Post not found!",
        });

        return res.status(200).json(post);
    }catch(err){
        next(err);
    }
};

exports.updatePost = async(req, res, next) =>{
    try{
        const {title, content} = req.body;
        const postId = req.params.id;
        const updatedPost = await postQueries.updatePost(postId, {title, content});

        return res.status(200).json(updatedPost);
    }catch(err){    
        next(err);
    }
}

exports.changePublishStatus = async(req, res, next) =>{
    try{
        const postId = req.params.id;
        const {publishStatus} = req.body;
        const publishTime = publishStatus? new Date(): null;
        
        const updatedPost = await postQueries.changePublishStatus(postId, publishStatus, publishTime);
        return res.status(200).json(updatedPost);

    }catch(err){
        next(err);
    }
};

exports.deletePost = async(req, res, next) =>{
    try{
        const postId = req.params.id;
        await postQueries.deletePost(postId);
        return res.status(204).send();
    }catch(err){
        next(err);
    }
}