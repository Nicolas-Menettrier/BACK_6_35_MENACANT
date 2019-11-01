let database = require('../database/database');

const resolvers = {
    Mutation: {
        like: async (parent, { postId }, context) => {
            const post = database.posts.find(post => post.id === postId);
            if (!post) throw new Error('post not found');
            const user = database.users.find(user => user.id === post.user);
            if (!user) throw new Error('internal server error');
            if (user.id !== context.user.id && post.mode === 1 && !database.follows.find(follow => follow.followed === user.id && follow.follower === context.user.id))
                throw new Error('not allowed');
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
            if (user.id !== context.user.id && user.mode === 1 && !database.follows.find(follow => follow.followed === user.id && follow.follower === context.user.id))
                throw new Error('not allowed');
            const likes = database.likes.filter(like => like.user === userId);
            let posts = [];
            likes.forEach(like => {
                const post = database.posts.find(post => post.id === like.post);
                if (post) posts.push(post);
                else {
                    database.likes = database.likes.filter(l => l.id !== like.id);
                }
            });
            return likes;
        },

        liked: (parent, { postId }, context) => {
            const post = database.posts.find(post => post.id === postId);
            if (!post) throw new Error('post not found');
            const user = database.users.find(user => user.id === post.user);
            if (!user) throw new Error('internal server error');
            if (user.id !== context.user.id && (user.mode === 1 || post.mode === 1) && !database.follows.find(follow => follow.followed === user.id && follow.follower === context.user.id))
                throw new Error ('not allowed');
            const likes = database.likes.filter(like => like.user === user.id);
            let posts = [];
            likes.array.forEach(like => {
                const post = database.posts.find(post => post.id === like.post);
                if (post) posts.push(post);
                else {
                    database.likes = database.likes.filter(l => l.id !== like.id);
                }
            });
            return likes;
        }
    },

    Like: {
        id: (like) => like.id,
        post: (like) => database.posts.find(post => post.id === like.post),
        user: (like) => database.users.find(user => user.id === like.user)
    }
};

module.exports = resolvers;