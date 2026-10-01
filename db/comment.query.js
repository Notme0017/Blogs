const prisma = require("../config/prisma");

class Comment{
    async getAllCommentsByPostId(postId, skip, limit){
        return prisma.comment.findMany({
            where: {postId: postId},
            select: {
                id: true,
                content: true,
                timestamp: true,
                user: {
                    select:{
                        id: true,
                        username: true,
                        isAuthor: true,
                    },
                },
            },
            orderBy: {timestamp: "desc"},
            skip,
            take: limit,
        });
    };

    async getCommentByCommentId(commentId){
        return prisma.comment.findUnique({
            where: {id: commentId},
            select: {
                id: true,
                content: true,
                timestamp: true,
                user: {
                    select:{
                        id: true,
                        username: true,
                        isAuthor: true,
                    },
                },
                post:{
                    select: {
                        id: true,
                        title: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                    },
                },
            },
        });
    };

    async getTotalCommentCountByPostId(postId){
        return prisma.comment.count({
            where: {postId: postId},
        })
    };

    async createComment(content, userId, postId){
        return prisma.comment.create({
            data: {
                content: content,
                userId: userId,
                postId: postId,
            },
        });
    };

    async updateComment(commentId, content){
        return prisma.comment.update({
            where: { id: commentId},
            data: {
                content: content,
                timestamp: new Date(),
            },
            select: {
                id: true,
                content: true,
                timestamp: true,
                user: {
                    select:{
                        id: true,
                        username: true,
                        isAuthor: true
                    },
                },
                post:{
                    select:{
                        id: true,
                        title: true,
                        user: {
                            select:{
                                id: true,
                                username: true,
                                isAuthor: true,
                            },
                        },
                    },
                },
            },
        });
    };

    async deleteComment(commentId){
        return prisma.comment.delete({
            where: {id: commentId}
        });
    }
}

module.exports = new Comment();