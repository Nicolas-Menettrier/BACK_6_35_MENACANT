let { users, posts, likes, reposts } = require('../database/database');
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
            const permission = getPermission(context.user, user);
            const userPosts = posts.filter(post => post.user === user.id && post.mode <= permission);
            return userPosts;
        },
        posts: (user, args, context) => {
            const permission = getPermission(context.user, user);
            const userPosts = posts.filter(post => post.user === user.id && post.post === null && post.mode <= permission);
            return userPosts;
        },
        comments: (user, args, context) => {
            const permission = getPermission(context.user, user);
            const userComments = posts.filter(comment => comment.user === user.id && comment.post !== null && comment.mode <= permission);
            return userComments;
        },
        description: (user) => user.description,
        mode: (user) => user.mode,
        likes: (user, args, context) => {
            const userLikes = likes.filter(like => like.user === user.id);
            let likePosts = [];
            userLikes.forEach(like => {
                const post = posts.find(post => post.id === like.post);
                if (post) likePosts.push(post);
                else likes = likes.filter(l => l.id !== like.id); // TODO REPLACE BY REAL DB
            });
            return { "count": likePosts.length, "posts": likePosts };
        },
        reposts: (user, args, context) => {
            const userReposts = reposts.filter(repost => repost.user === user.id);
            let repostPosts = [];
            userReposts.forEach(repost => {
                const post = posts.find(post => post.id === repost.post);
                if (post) repostPosts.push(post);
                else reposts = reposts.filter(r => r.id !== repost.id);
            });
            return { "count": repostPosts.length, "posts": repostPosts };
        }
    },

    Users: {
        count: (users) => users.count,
        users: (users) => users.users
    }
};

module.exports = resolvers;