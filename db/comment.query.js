const prisma = require("../config/prisma");

class Comment{
    async getAllCommentsByPostId(postId){
        return prisma.comment.findMany({
            where: {postId: postId}
        });
    };
}

modulee.exports = Comment;