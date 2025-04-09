import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', event.url.pathname, { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	const clients = db.clients.find().toArray();
	const services = db.services
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
			// 	$match: {
			// 		lawyer_id: event.locals.user.role === 'Lawyer' ? event.locals.user._id : ''
			// 	}
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
			}
		])
		.toArray();
	const cases = db.cases.find().toArray();

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/dashboard', text: 'Dashboard' }
		],
		clients,
		services,
		cases
	};
};
