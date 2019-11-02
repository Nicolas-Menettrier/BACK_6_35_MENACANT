let { users, posts, follows } = require('../database/database');

const resolvers = {
    Mutation: {
        post: async (parent, { message, mode, comments }, context) => {
            const post = {
                'id': posts[posts.length - 1].id + 1,
                'message': message,
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
            if (user.id !== context.user.id && (user.mode || post.mode === 1) && !follows.find(follow => follow.followed === user.id && follow.follower === context.user.id))
                throw new Error('not allowed');
            return post;
        },

        posts: (parent, { userId }, context) => {
            if (userId !== undefined) {
                const user = users.find(user => user.id === userId);
                if (!user) throw new Error('user not found');
                const follow = follows.find(follow => follow.followed === user.id && follow.follower === context.user.id);
                let permission = 1;
                if (context.user.id !== user.id && !follow) {
                    if (user.mode === 1) throw new Error('not allowed');
                    permission = 0;
                }
                return posts.filter(post => post.post === null && post.user === user.id && post.mode <= permission);
            }
            return posts.filter(post => post.post === null && post.user === context.user.id);
        },

        all: (parent, { userId }, context) => {
            if (userId !== undefined) {
                const user = users.find(user => user.id === userId);
                if (!user) throw new Error('user not found');
                const follow = follows.find(follow => follow.followed === user.id && follow.follower === context.user.id);
                let permission = 1;
                if (context.user.id !== user.id && !follow) {
                    if (user.mode === 1) throw new Error('not allowed');
                    permission = 0;
                }
                return posts.filter(post => post.user === user.id && post.mode <= permission);
            }
            return posts.filter(post => post.user === context.user.id);
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