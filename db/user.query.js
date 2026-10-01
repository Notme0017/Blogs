const prisma = require("../config/prisma");

class User{
    async getUserById(userId){
        return prisma.user.findUnique({
            where: {id: userId},
            select: {
                id: true,
                username: true,
                isAuthor: true,
                posts: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        timestamp: true,
                        post: {
                            select: {
                                id: true,
                                title: true,
                                userId: true,
                            },
                        },
                    }
                },
            },
        });
    };

    async findUserByUsername(username){
        return prisma.user.findFirst({
            where: {username: username},
            select: {username: true}
        });
    }

    async getUserByUsername(username){
        return prisma.user.findFirst({
            where: {username: username},
            select: {
                id: true,
                username: true,
                password: true,
                isAuthor: true,
                posts: {
                    select:{
                        id: true,
                    }
                },
                comments: {
                    select: {
                        id: true,
                    },
                },
            },
        });
    };

    async createUser(username, password){
        return prisma.user.create({
            data: {
                username: username,
                password: password,
            }
        });
    };
}

module.exports = new User();