const merge = require('lodash/merge');
const userResolver = require('./user');
const postResolver = require('./post');
const commentResolver = require('./comment');
const likeResolver = require('./like');

const resolvers = merge([userResolver, postResolver, commentResolver, likeResolver]);

module.exports = resolvers;