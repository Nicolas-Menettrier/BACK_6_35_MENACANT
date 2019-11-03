const database = {
    users: [
        {
            'id': 0,
            'username': 'arnaud',
            'email': 'arnaud.pinta@gmail.com',
            'description': 'je m\'appelle arnaud et j\'ai 12 ans',
            'password': 'azerty',
            'mode': 0
        },
        {
            'id': 1,
            'username': 'thomas',
            'email': 'thomas.pinta@gmail.com',
            'description': 'thomas pinta\n20 ans',
            'password': 'qsdfgh',
            'mode': 0
        },
        {
            'id': 2,
            'username': 'julien',
            'email': 'pintajulien@gmail.com',
            'description': 'french artist',
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
            'date': '11/01/2019 09:44 PM'
        },
        {
            'id': 1,
            'message': 'salut',
            'user': 1,
            'post': null,
            'mode': 0,
            'comments': true,
            'date': '11/01/2019 11:12 PM'
        },
        {
            'id': 2,
            'message': 'au revoir',
            'user': 0,
            'post': null,
            'mode': 1,
            'comments': true,
            'date': '11/02/2019 04:44 AM'
        },
        {
            'id': 3,
            'message': 'pas de commentaire',
            'user': 2,
            'post': null,
            'mode': 0,
            'comments': false,
            'date': '11/02/2019 08:09 AM'
        },
        {
            'id': 4,
            'message': 'yo yo',
            'user': 1,
            'post': 0,
            'mode': 0,
            'comments': false,
            'date': '11/03/2019 01:12 PM'
        },
        {
            'id': 5,
            'message': 'comment va?',
            'user': 0,
            'post': 1,
            'mode': 0,
            'comments': false,
            'date': '11/03/2019 10:44 PM'
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
        },
        {
            'id': 1,
            'post': 0,
            'user': 1
        },
        {
            'id': 2,
            'post': 0,
            'user': 2
        },
        {
            'id': 3,
            'post': 0,
            'user': 2
        }
    ],
    reposts: [
        {
            'id': 0,
            'post': 0,
            'user': 1
        },
        {
            'id': 1,
            'post': 0,
            'user': 1
        },
        {
            'id': 2,
            'post': 0,
            'user': 2
        },
        {
            'id': 3,
            'post': 0,
            'user': 2
        }
    ]
};

module.exports = database;