let database = require('../database/database');
const getPermission = require('../permissions');

const resolvers = {
    Mutation: {
        repost: async (parent, { postId }, context) => {
            const post = database.posts.find(post => post.id === postId);
            if (!post) throw new Error('post not found');
            const user = database.users.find(user => user.id === post.user);
            if (!user) throw new Error('internal server error');
            getPermission(context.user, user, post);
            if (database.reposts.find(repost => repost.post === post.id && repost.user === context.user.id))
                throw new Error('already reposted');
            const repost = {
                'id': database.reposts[database.reposts.length - 1].id + 1,
                'post': postId,
                'user': context.user.id
            };
            database.reposts.push(repost); // TODO REPLACE BY REAL DB
            return repost;
        },

        unrepost: async (parent, { postId }, context) => {
            const repost = database.reposts.find(repost => repost.post === postId);
            if (!repost) throw new Error('post not found');
            database.reposts = database.reposts.filter(r => r.id !== repost.id) // TO DO REPLACE BY REAL DB
            return repost;
        }
    },

    Query: {
        reposts: (parent, { userId }, context) => {
            const user = userId !== undefined ? database.users.find(user => user.id === userId) : context.user;
            if (!user) throw new Error('user not found');
            getPermission(context.user, user);
            const reposts = database.reposts.filter(repost => repost.user === user.id);
            let repostedPosts = [];
            reposts.forEach(repost => {
                const post = database.posts.find(post => post.id === repost.post);
                if (post) repostedPosts.push(post);
                else {
                    database.reposts = database.reposts.filter(r => r.id !== repost.id);
                }
            });
            return repostedPosts;
        },

        reposted: (parent, { postId }, context) => {
            const post = database.posts.find(post => post.id === postId);
            if (!post) throw new Error('post not found');
            const user = database.users.find(user => user.id === post.user);
            if (!user) throw new Error('internal server error');
            getPermission(context.user, user, post);
            const reposts = database.reposts.filter(repost => repost.post === post.id);
            let repostUsers = [];
            reposts.forEach(repost => {
                const user = database.users.find(user => user.id === repost.id);
                if (user) repostUsers.push(user);
                else database.reposts = database.reposts.filter(r => r.id !== repost.id);
            });
            return repostUsers;
        }
    }
};

module.exports = resolvers;