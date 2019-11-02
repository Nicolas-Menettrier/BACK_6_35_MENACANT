let database = require('../database/database');
const getPermission = require('../permissions');

const resolvers = {
    Mutation: {
        like: async (parent, { postId }, context) => {
            const post = database.posts.find(post => post.id === postId);
            if (!post) throw new Error('post not found');
            const user = database.users.find(user => user.id === post.user);
            if (!user) throw new Error('internal server error');
            getPermission(context.user, user, post);
            if (database.likes.find(like => like.post === post.id && like.user === context.user.id))
                throw new Error('already liked');
            const like = {
                'id': database.likes[database.likes.length - 1].id + 1,
                'post': postId,
                'user': context.user.id
            };
            database.likes.push(like); // TODO REPLACE BY REAL DB
            return like;
        },

        unlike: async (parent, { postId }, context) => {
            const like = database.likes.find(like => like.post === postId);
            if (!like) throw new Error('post not found');
            database.likes = database.likes.filter(l => l.id !== like.id) // TO DO REPLACE BY REAL DB
            return like;
        }
    },

    Query: {
        likes: (parent, { userId }, context) => {
            const user = database.users.find(user => user.id === userId);
            if (!user) throw new Error('user not found');
            getPermission(context.user, user);
            const likes = database.likes.filter(like => like.user === user.id);
            let likedPosts = [];
            likes.forEach(like => {
                const post = database.posts.find(post => post.id === like.post);
                if (post) likedPosts.push(post);
                else {
                    database.likes = database.likes.filter(l => l.id !== like.id);
                }
            });
            return { "count": posts.length, "posts": likedPosts };
        },

        liked: (parent, { postId }, context) => {
            const post = database.posts.find(post => post.id === postId);
            if (!post) throw new Error('post not found');
            const user = database.users.find(user => user.id === post.user);
            if (!user) throw new Error('internal server error');
            getPermission(context.user, user, post);
            const likes = database.likes.filter(like => like.post === post.id);
            let likeUsers = [];
            likes.forEach(like => {
                const user = database.users.find(user => user.id === like.id);
                if (user) likeUsers.push(user);
                else database.likes = database.likes.filter(l => l.id !== like.id);
            });
            return { "count": likeUsers.length, "users": likeUsers };
        }
    },

    Like: {
        id: (like) => like.id,
        post: (like) => database.posts.find(post => post.id === like.post),
        user: (like) => database.users.find(user => user.id === like.user)
    },

    Likes: {
        count: (likes) => likes.count,
        posts: (likes) => likes.posts
    },

    Liked: {
        count: (likes) => likes.count,
        users: (likes) => likes.users
    }
};

module.exports = resolvers;