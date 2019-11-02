let { users, follows } = require('../database/database');

const resolvers = {
    Mutation: {
        follow: async (parent, { userId }, context) => {
            const user = users.find(user => user.id === userId); // TODO REPLACE BY REAL DB
            if (!user) throw new Error('user not found');
            if (follows.find(follow => follow.follower === context.user.id && follow.followed === userId))
                throw new Error('already following');
            const follow = {
                'id': follows[follows.length - 1].id + 1,
                'follower': context.user.id,
                'followed': user.id
            };
            follows.push(follow); // TODO REPLACE BY REAL DB
            return follow;
        },

        unfollow: async (parent, { userId }, context) => {
            const user = users.find(user => user.id === userId); // TODO REPLACE BY REAL DB
            if (!user) throw new Error('user not found');
            const follow = follows.find(follow => follow.follower === context.user.id && follow.followed === userId);
            if (!follow) throw new Error('not following');
            follows = follows.filter(f => f.id !== follow.id);
            return follow;
        }
    },

    Query: {
        follows: (parent, { userId }, context) => {
            if (userId !== undefined) {
                const user = users.find(user => user.id === userId); // TODO REPLACE BY REAL DB
                if (!user) throw new Error('user not found');
                if (user.id !== context.user.id && user.mode === 1 && !follows.find(follow => follow.followed === user.id && follow.follower === context.user.id))
                    throw new Error('not allowed');
                return users.filter(u => follows.find(follow => follow.followed === u.id && follow.follower === user.id));
            }
            return users.filter(user => follows.find(follow => follow.followed === user.id && follow.follower === context.user.id));
        },

        followers: (parent, { userId }, context) => {
            if (userId !== undefined) {
                const user = users.find(user => user.id === userId); // TODO REPLACE BY REAL DB
                if (!user) throw new Error('user not found');
                if (user.id !== context.user.id && user.mode === 1 && !follows.find(follow => follow.followed === user.id && follow.follower === context.user.id))
                    throw new Error('not allowed');
                return users.filter(u => follows.find(follow => follow.followed === user.id && follow.follower === u.id));
            }
            return users.filter(user => follows.find(follow => follow.followed === context.user.id && follow.follower === user.id));
        }
    },

    Follow: {
        id: (follow) => follow.id,
        follower: (follow) => users.find(user => user.id === follow.follower),
        followed: (follow) => users.find(user => user.id === follow.followed)
    }
};

module.exports = resolvers;