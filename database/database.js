const database = {
    users: [
        {
            'id': 0,
            'username': 'arnaud',
            'email': 'arnaud.pinta@gmail.com',
            'password': 'azerty',
            'mode': 0
        },
        {
            'id': 1,
            'username': 'thomas',
            'email': 'thomas.pinta@gmail.com',
            'password': 'qsdfgh',
            'mode': 0
        },
        {
            'id': 2,
            'username': 'julien',
            'email': 'pintajulien@gmail.com',
            'password': 'wxcvbn',
            'mode': 0
        }
    ],
    posts: [
        {
            'id': 0,
            'message': 'bonjour',
            'user': 0,
            'post': null,
            'mode': 0,
            'comments': true,
        },
        {
            'id': 1,
            'message': 'salut',
            'user': 1,
            'post': null,
            'mode': 0,
            'comments': true
        },
        {
            'id': 2,
            'message': 'au revoir',
            'user': 0,
            'post': null,
            'mode': 1,
            'comments': true
        },
        {
            'id': 3,
            'message': 'pas de commentaire',
            'user': 2,
            'post': null,
            'mode': 0,
            'comments': false
        },
        {
            'id': 4,
            'message': 'yo yo',
            'user': 1,
            'post': 0,
            'mode': 0,
            'comments': false
        },
        {
            'id': 5,
            'message': 'comment va?',
            'user': 0,
            'post': 1,
            'mode': 0,
            'comments': false
        }
    ],
    follows: [
        {
            'id': 0,
            'follower': 0,
            'followed': 1
        },
        {
            'id': 1,
            'follower': 0,
            'followed': 2
        },
        {
            'id': 2,
            'follower': 2,
            'followed': 1
        }
    ],
    likes: [
        {
            'id': 0,
            'post': 0,
            'user': 1
        }
    ]
};

module.exports = database;