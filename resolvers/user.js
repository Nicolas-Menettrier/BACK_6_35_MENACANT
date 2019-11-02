let { users, posts } = require('../database/database');
const getPermission = require('../permissions');

const resolvers = {
    Mutation: {
        mode: (parent, args, context) => {
            const user = users.find(user => user.id === context.user.id);
            if (!user) throw new Error('internal server error');
            user.mode = (user.mode + 1) % 2;
            return user;
        },

        description: (parent, { description }, context) => {
            const user = users.find(user => user.id === context.user.id);
            if (!user) throw new Error('internal server error');
            if (description.length > 64) throw new Error('description must be at max 64 caracters long');
            user.description = description;
            return user;
        }
    },

    Query: {
        user: (parent, { id }, context) => {
            if (id !== undefined) {
                const user = users.find(user => user.id === id);
                if (!user) throw new Error('not found');
                getPermission(context.user, user);
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
        email: (user) => user.email,
        all: (user, args, context) => {
            let permission = getPermission(context.user, user);
            return posts.filter(post => post.user === user.id && post.mode <= permission);
        },
        posts: (user, args, context) => {
            let permission = getPermission(context.user, user);
            return posts.filter(post => post.user === user.id && post.post === null && post.mode <= permission);
        },
        comments: (user, args, context) => {
            let permission = getPermission(context.user, user);
            return posts.filter(comment => comment.user === user.id && comment.post !== null && comment.mode <= permission);
        },
        description: (user) => user.description,
        mode: (user) => user.mode
    }
};

module.exports = resolvers;