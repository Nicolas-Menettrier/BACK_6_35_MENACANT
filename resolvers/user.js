let { users, posts, follows } = require('../database/database');

const resolvers = {
    Mutation: {
        mode: (parent, args, context) => {
            const user = users.find(user => user.id === context.user.id);
            if (!user) throw new Error('internal server error');
            user.mode = (user.mode + 1) % 2;
            return user;
        }
    },

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
        },

        search: (parent, { search, size }, context) => {
            search = search.toLowerCase();
            return users.filter(user => user.username.toLowerCase().includes(search)).slice(0, size ? size : 5);
        }
    },

    User: {
        id: (user) => user.id,
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
        },
        mode: (user) => user.mode
    }
};

module.exports = resolvers;