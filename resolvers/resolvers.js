const merge = require('lodash/merge');
const userResolver = require('./user');
const postResolver = require('./post');
const commentResolver = require('./comment');
const likeResolver = require('./like');
const repostResolver = require('./repost');
const followResolver = require('./follow');

const resolvers = merge([
    userResolver,
    postResolver,
    commentResolver,
    likeResolver,
    repostResolver,
    followResolver
]);

module.exports = resolvers;