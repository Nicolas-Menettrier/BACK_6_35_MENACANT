let { follows } = require('./database/database');

const getPermission = function(connectedUser, user, post) {
    if (user.id !== connectedUser.id) {
        const follow = follows.find(follow => follow.followed === user.id && follow.follower === connectedUser.id);
        if (!follow) {
            if (user.mode === 1 || (post && post.mode === 1)) {
                throw new Error('not allowed');
            }
            return 0;
        }
    }
    return 1;
}

module.exports = getPermission;