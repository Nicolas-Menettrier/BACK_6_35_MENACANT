const merge = require('lodash/merge');
const userResolver = require('./user');
const postResolver = require('./post');
const commentResolver = require('./comment');
const likeResolver = require('./like');
const followResolver = require('./follow');

const resolvers = merge([
    userResolver,
    postResolver,
    commentResolver,
    likeResolver,
    followResolver
]);

module.exports = resolvers;