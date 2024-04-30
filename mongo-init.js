db.users.insertOne({
	_id: '1',
	username: 'admin',
	hashedPassword:
		'$argon2id$v=19$m=19456,t=2,p=1$9pRcWSi/VmNeYOQ/JA7Mhg$GOHloucwALRVHbF7OKv1J8YMTfF0SePJU1XG20e4Nf4',
	role: 'Administrator'
});
