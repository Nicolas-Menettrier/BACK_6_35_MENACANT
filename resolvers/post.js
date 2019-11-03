const database = require('../database/database');
const getPermission = require('../permissions');

const resolvers = {
    Mutation: {
        post: async (parent, { message, mode, comments }, context) => {
            if (message.length > 256) throw new Error('message must be at max 256 caracters long');
            const post = {
                'id': posts[posts.length - 1].id + 1,
                'message': message,
                'user': context.user.id,
                'mode': mode !== undefined ? mode : 0,
                'comments': comments !== undefined ? comments : true,
                'post': null
            };
            const db = await database();
            db.collection("posts").insertOne(post);
            return post;
        },

        removePost: async (parent, { id }, context) => {
            const db = await database();
            const post = await db.collection("posts").find({ id });
            if (!post) throw new Error('not found');
            const user = await db.collection("users").find({ id: post.user });
            if (!user) throw new Error('internal server error');
            if (user.id !== context.user.id) throw new Error('not allowed');
            posts = posts.filter(p => p.id !== post.id); // TODO REPLACE BY REAL DB
            return post;
        }
    },

    Query: {
        post: (parent, { id }, context) => {
            const post = posts.find(post => post.id === id);
            if (!post) throw new Error('not found');
            const user = users.find(user => user.id === post.user);
            if (!user) throw new Error('internal server error');
            getPermission(context.user, user, post);
            return post;
        },

        posts: (parent, { userId }, context) => {
            if (userId !== undefined) {
                const user = users.find(user => user.id === userId);
                if (!user) throw new Error('user not found');
                let permission = getPermission(context.user, user);
                return posts.filter(post => post.post === null && post.user === user.id && post.mode <= permission);
            }
            return posts.filter(post => post.post === null && post.user === context.user.id);
        },

        all: (parent, { userId }, context) => {
            if (userId !== undefined) {
                const user = users.find(user => user.id === userId);
                if (!user) throw new Error('user not found');
                let permission = getPermission(context.user, user);                
                return posts.filter(post => post.user === user.id && post.mode <= permission);
            }
            return posts.filter(post => post.user === context.user.id);
        }
    },

    Post: {
        id: (post) => post.id,
        message: (post) => post.message,
        user: (post) => users.find(user => user.id === post.user),
        comments: (post) => posts.filter(comment => comment.post === post.id),
        mode: (post) => post.mode,
        likes: (post) => {
            const user = users.find(user => user.id === post.user);
            if (!user) throw new Error('internal server error');
            const postLikes = likes.filter(like => like.post === post.id);
            let likeUsers = [];
            postLikes.forEach(like => {
                const user = users.find(user => user.id === like.id);
                if (user) likeUsers.push(user);
                else likes = likes.filter(l => l.id !== like.id);
            });
            return { "count": likeUsers.length, "users": likeUsers };
        }
    }
};

module.exports = resolvers;