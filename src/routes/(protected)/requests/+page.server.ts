import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', '/dashboard', { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/requests', text: 'Requests' }
		],
		requests: db.requests.aggregate([{
			$lookup: {
				from: 'users',
				localField: 'lawyer_id',
				foreignField: '_id',
				as: 'lawyer'
			},
		}, {
			$unwind: {
				path: '$lawyer',
				preserveNullAndEmptyArrays: true
			}
		}, {
			$match: { lawyer_id: event.locals.user.role === 'Administrator' ? { $exists: true } : event.locals.user._id }
		}, {
			$lookup: {
				from: 'users',
				localField: 'client_id',
				foreignField: '_id',
				as: 'client'
			},
		}, {
			$unwind: {
				path: '$client',
				preserveNullAndEmptyArrays: true
			}
		}, {
			$project: {
				_id: '$_id',
				client: '$client.name',
				lawyer: '$lawyer.name',
				status: '$status.type',
				date: '$status.date',
				natureOfRequest: '$natureOfRequest',
			}
		}]).toArray()
	};
};
