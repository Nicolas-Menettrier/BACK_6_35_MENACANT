let { users, posts, comments, follows } = require('../database/database');

const resolvers = {
    Mutation: {
        post: async (parent, { message, mode, comments }, context) => {
            const post = {
                'id': posts[posts.length - 1].id + 1,
                'post': message,
                'user': context.user.id,
                'mode': mode !== undefined ? mode : 0,
                'comments': comments !== undefined ? comments : true
            };
            posts.push(post); // TODO REPLACE BY REAL DB
            return post;
        }
    },

    Query: {
        post: (parent, { id }, context) => {
            const post = posts.find(post => post.id === id);
            if (!post) throw new Error('not found');
            const user = users.find(user => user.id === post.user);
            if (!user) throw new Error('internal server error');
            if (user.id !== context.user.id && post.mode === 1 && !follows.find(follow => follow.followed === user.id && follow.follower === context.user.id))
                throw new Error('not allowed');
            return post;
        },

        posts: (parent, { userId }, context) => {
            if (userId !== undefined) {
                const user = users.find(user => user.id === userId);
                if (!user) throw new Error('user not found');
                if (context.user.id !== user.id && user.mode === 1 && !follows.find(follow => follow.followed === user.id && follow.follower === context.user.id))
                    throw new Error('not allowed');
                return posts.filter(post.post === null && post.user === user.id);
            }
            return posts.filter(post.post === null && post.user === context.user.id);
        }
    },

    Post: {
        id: (post) => post.id,
        message: (post) => post.message,
        user: (post) => users.find(user => user.id === post.user),
        comments: (post) => posts.filter(comment => comment.post === post.id)
    }
};

module.exports = resolvers;