let { users, posts, follows } = require('../database/database');

const resolvers = {
    Mutation: {
        comment: async (parent, { postId, message, mode }, context) => {
            const post = posts.find(post => post.id === postId); // TODO REPLACE BY REAL DB
            if (!post) throw new Error('post not found');
            const user = users.find(user => user.id === post.user); // TODO REPLACE BY REAL DB
            if (!user) throw new Error('internal server error');
            if (!post.comments || (user.id !== context.user.id && post.mode === 1 && !follows.find(follow => follow.followed === user.id && follow.follower === context.user.id)))
                throw new Error('not allowed');
            const comment = {
                'id': posts[posts.length - 1].id + 1,
                'comment': message,
                'post': post,
                'user': user.id,
                'mode': mode !== undefined ? mode : 0
            };
            post.push(comment); // TODO REPLACE BY REAL DB
            return comment;
        }
    },

    Query: {
        comment: (parent, { id }, context) => {
            const comment = posts.find(post => post.id === id);
            if (!comment) throw new Error('not found');
            const user = users.find(user => user.id === comment.user);
            if (!user) throw new Error('internal server error');
            if (user.id !== context.user.id && comment.mode === 1 && !follows.find(follow => follow.followed === user.id && follow.follower === context.user.id))
                throw new Error('not allowed');
            return comment;
        },

        comments: (parent, { userId, postId }, context) => {
            if (userId !== undefined && postId !== undefined) {
                const user = users.find(user => user.id === userId);
                const post = posts.find(post => post.id === postId);
                if (!user) throw new Error('user not found');
                if (!post) throw new Error('post not found');
                return posts.filter(post => post.post !== null && post.id === postId && post.user === userId);
            } else if (userId !== undefined) {
                const user = users.find(user => user.id === userId);
                if (!user) throw new Error('user not found');
                return posts.filter(post => post.post !== null && post.user === userId);
            } else if (postId !== undefined) {
                const post = posts.find(post => post.id === postId);
                if (!post) throw new Error('post not found');
                return posts.filter(post => post.post !== null && post.id === postId);
            } else {
                return posts.filter(post => post.post !== null && post.user === context.user.id);
            }
        }
    },

    Post: {
        post: (comment) => posts.find(post => post.id === comment.post)
    }
};

module.exports = resolvers;