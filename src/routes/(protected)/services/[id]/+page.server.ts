import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', event.url.pathname, { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	const service = await db.services
		.aggregate([
			{
				$match: { _id: event.params.id }
			},
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
				$addFields: {
					interviewee: { $arrayElemAt: ['$interviewee', 0] }
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
		.next();
	if (!service) redirect('/services', { type: 'warning', message: 'Service not found!' }, event);

	const client = service.client;

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/services', text: 'Services' },
			{
				href: '/services/' + event.params.id,
				text: service.nature.includes('Barangay Outreach')
					? `${service.barangay} - ${service.problemsPresented}`
					: `${[...service.nature, ...(service.otherNature ?? [])].join(', ')} - ${client.length > 1 ? (client.length > 2 ? `${client[0].lastName} et al.` : `${client[0].lastName} and ${client[1].lastName}`) : client[0].name}`
			}
		],
		client,
		service
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			event.cookies.set('redirect', event.params.id, { path: '/' });
			redirect(
				'/login',
				{ type: 'warning', message: 'You must be logged in to access this page!' },
				event
			);
		}

		event.cookies.set('controlNo', event.params.id, { path: '/' });

		redirect('/cases/add', { type: 'info', message: `Add service for ${event.locals}.` }, event);
	}
};
