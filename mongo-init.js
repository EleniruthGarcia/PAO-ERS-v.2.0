db.branches.insertMany([
	{
		_id: 'car',
		name: 'Regional Office - CAR',
		district: 'Baguio City',
		province: 'Benguet',
		region: 'Cordillera Administrative Region',
	}, {
		_id: 'Baguio',
		name: 'Baguio City District Office',
		district: 'Baguio City',
		province: 'Benguet',
		region: 'Cordillera Administrative Region',
	}
]);

db.users.insertOne({
	_id: '1',
	username: 'admin',
	name: 'Admin',
	branch_id: 'car',
	position: 'Administrative Officer',
	rank: 'I',
	hashedPassword:
		'$argon2id$v=19$m=19456,t=2,p=1$9pRcWSi/VmNeYOQ/JA7Mhg$GOHloucwALRVHbF7OKv1J8YMTfF0SePJU1XG20e4Nf4',
	role: 'Administrator',
	status: [{
		type: 'New',
		date: Date.now(),
	}]
});
