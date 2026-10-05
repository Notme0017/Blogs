const prisma = require("../config/prisma")

class Post{
    async getAllPublishedPost(skip, limit){
        return prisma.post.findMany({
            where: {published: true},
            select: {id: true,
                title: true,
                content: true,
                publishTime: true,
                user:{
                    select:{
                        id: true,
                        username: true,
                        isAuthor: true,
                    }
                },
                _count:{
                    select: {comments: true},
                },
            },
            orderBy: {publishTime: "desc"},
            skip,
            take: limit,
        });
    };

     async getAllPost(userId, skip, limit){
        return prisma.post.findMany({
            where: {userId: userId},
            select: {
                id: true,
                title: true,
                content: true,
                uploadTime: true,
                published: true,
                publishTime: true,
                user:{
                    select:{
                        id: true,
                        username: true,
                        isAuthor: true,
                    }
                },
                _count:{
                    select: {comments: true},
                },
            },
            orderBy: {uploadTime: "desc"},
            skip,
            take: limit,
        });
    };
    
    async getPublishedPostCount(){
        return prisma.post.count({
            where: {published: true},
        });
    };

    async getAllPostCount(userId){
        return prisma.post.count({
            where: {userId: userId}
        });
    };

    async getUserIdByPostId(postId){
        return prisma.post.findUnique({
            where: { id: postId},
            select: {
                user: {
                    select: {
                        id: true,
                    },
                },
            },
        });
    }

    async getPostById(postId, userId){
        return prisma.post.findUnique({
            where: {id: postId, userId: userId},
            select: {
                id: true,
                title: true,
                content: true,
                uploadTime: true,
                published: true,
                publishTime: true,
                user:{
                    select: {
                        id: true,
                        username: true,
                        isAuthor: true,
                    },
                },
                _count: {
                    select: {comments: true},
                },
            },
        });
    };

    async getPublishedPostById(postId){
        return prisma.post.findFirst({
            where: {id: postId,
                published: true,
            },
            select: {
                id: true,
                title: true,
                content: true,
                uploadTime: true,
                published: true,
                publishTime: true,
                user:{
                    select: {
                        id: true,
                        username: true,
                        isAuthor: true,
                    },
                },
                _count: {
                    select: {comments: true},
                },
            },
        });
    };

    async createPost(title, content, userId){
        return prisma.post.create({
            data: {
                title: title,
                content: content,
                userId: userId,
            },
        });
    };

    async updatePost(postId, {title, content}){
        return prisma.post.update({
            where: {id: postId},
            data: {
                title: title,
                content: content,
            },
            select: {
                id: true,
                title: true,
                content: true,
                uploadTime: true,
                published: true,
                publishTime: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        isAuthor: true,
                    },
                },
            },
        });
    };

    async changePublishStatus(postId, publishStatus, publishTime){
        return prisma.post.update({
            where: {id: postId},
            data: {
                published: publishStatus,
                publishTime: publishTime,
            },
            select: {
                id: true,
                title: true,
                content: true,
                uploadTime: true,
                published: true,
                publishTime: true,
                user: {
                    select:{
                        id: true,
                        username: true,
                        isAuthor: true,
                    },
                },
            },
        });
    };

    async deletePost(postId){
        return prisma.post.delete({
            where: {id: postId},
        });
    };
}

module.exports = new Post();