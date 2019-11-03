let { users, posts } = require('../database/database');
const getPermission = require('../permissions');
const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit" 
};

const resolvers = {
    Mutation: {
        comment: async (parent, { postId, message }, context) => {
            const post = posts.find(post => post.id === postId); // TODO REPLACE BY REAL DB
            if (!post) throw new Error('post not found');
            const user = users.find(user => user.id === post.user); // TODO REPLACE BY REAL DB
            if (!user) throw new Error('internal server error');
            if (!post.comments) throw new Error('comments are not allowed');
            getPermission(context.user, user, post);
            if (message.length > 256) throw new Error('message must be at max 256 caracters long');
            const comment = {
                'id': posts[posts.length - 1].id + 1,
                'message': message,
                'post': post.id,
                'user': context.user.id,
                'comments': true,
                'mode': 0,
                'date': new Date().toLocaleString("en-EN", options)
            };
            posts.push(comment); // TODO REPLACE BY REAL DB
            return comment;
        }
    },

    Query: {
        comment: (parent, { id }, context) => {
            const comment = posts.find(post => post.id === id);
            if (!comment) throw new Error('not found');
            const user = users.find(user => user.id === comment.user);
            if (!user) throw new Error('internal server error');
            getPermission(context.user, user, comment);
            return comment;
        },

        comments: (parent, { userId, postId }, context) => {
            if (userId !== undefined && postId !== undefined) {
                const user = users.find(user => user.id === userId);
                if (!user) throw new Error('user not found');
                const post = posts.find(post => post.id === postId);
                if (!post) throw new Error('post not found');
                getPermission(context.user, user, post);
                return posts.filter(post => post.post !== null && post.id === postId && post.user === userId);
            } else if (userId !== undefined) {
                const user = users.find(user => user.id === userId);
                if (!user) throw new Error('user not found');
                getPermission(context.user, user);
                return posts.filter(post => post.post !== null && post.user === userId);
            } else if (postId !== undefined) {
                const post = posts.find(post => post.id === postId);
                if (!post) throw new Error('post not found');
                const user = users.find(user => user.id === post.user);
                if (!user) throw new Error('user not found');
                getPermission(context.user, user, post);
                return posts.filter(post => post.post === post.id);
            } else {
                return posts.filter(post => post.post !== null && post.user === context.user.id);
            }
        }
    },

    Post: {
        post: (comment, args, context) => {
            if (comment.post === null) return null;
            const post = posts.find(post => post.id === comment.post);
            if (!post) throw new Error('post was removed');
            const user = users.find(user => user.id === post.user);
            if (!user) throw new Error('internal server error');
            try {
                getPermission(context.user, user, post);
            } catch (error) {
                return null;
            }
            return post;
        }
    }
};

module.exports = resolvers;