import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user?.role !== 'Administrator') {
		event.cookies.set('redirect', event.url.pathname, { path: '/' });
		redirect(
			'/login',
			{
				type: 'warning',
				message: 'You must be logged in as an administrator to access this page!'
			},
			event
		);
	}

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/admin', text: 'Dashboard' }
		],
		cases: db.cases.find().toArray(),
		clients: db.clients.find().toArray(),
		services: db.services
			.aggregate([
				{
					$lookup: {
						from: 'users',
						localField: 'lawyer_id',
						foreignField: '_id',
						as: 'lawyer'
					}
				},
				{
					$unwind: {
						path: '$lawyer',
						preserveNullAndEmptyArrays: true
					}
				},
				// {
				// 	$match: { lawyer_id: event.locals.user.role === 'Administrator' ? { $exists: true } : event.locals.user._id }
				// },
				{
					$lookup: {
						from: 'clients',
						localField: 'interviewee_id',
						foreignField: '_id',
						as: 'interviewee'
					}
				},
				{
					$lookup: {
						from: 'clients',
						localField: 'client_id',
						foreignField: '_id',
						as: 'client'
					}
				},
				{
					$lookup: {
						from: 'cases',
						localField: 'case_id',
						foreignField: '_id',
						as: 'case'
					}
				},
				// {
					// $addFields: {
						// 'client.age': {
						// 	$dateDiff: { startDate: '$client.dateOfBirth', endDate: '$$NOW', unit: 'year' }
						// }
					// }
				// }
			])
			.toArray(),
		users: db.users.find().toArray()
	};
};
