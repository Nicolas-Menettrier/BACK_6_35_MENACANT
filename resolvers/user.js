let { users, posts, follows } = require('../database/database');

const resolvers = {
    Query: {
        user: (parent, { id }, context) => {
            if (id !== undefined) {
                const user = users.find(user => user.id === id);
                if (!user) throw new Error('not found');
                if (user.id !== context.user.id && user.mode === 1 && !follows.find(follow => follow.followed === user.id && follow.follower === context.user.id))
                    throw new Error('not allowed');
                return user;
            }
            return context.user;
        }
    },

    User: {
        username: (user) => user.username,
        email: (user,) => user.email,
        posts: (user, args, context) => {
            let permission = 1;
            if (user.id !== context.user.id && !follows.find(follow => follow.followed === user.id && follow.follower === context.user.id))
                permission = 0;
            return posts.filter(post => post.user === user.id && post.post === null && post.mode <= permission);
        },
        comments: (user, args, context) => {
            let permission = 1;
            if (user.id !== context.user.id && !follows.find(follow => follow.followed === user.id && follow.follower === context.user.id))
                permission = 0;
            return posts.filter(comment => comment.user === user.id && comment.post !== null && comment.mode <= permission);
        }
    }
};

module.exports = resolvers;