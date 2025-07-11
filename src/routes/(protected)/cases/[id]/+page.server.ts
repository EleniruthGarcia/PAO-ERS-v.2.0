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

	const _case = await db.cases.findOne({ _id: event.params.id });
	if (!_case) redirect('/cases', { type: 'warning', message: 'Case not found!' }, event);

	const service = await db.services.findOne({ case_id: _case.docketNumber });
	// if (!service) redirect('/cases', { type: 'warning', message: 'Service not found!' }, event);

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/cases', text: 'Cases' },
			{
				href: '/cases/' + event.params.id,
				text: _case.titleOfTheCase || 'Untitled Case'
			}
		],
		_case,
		service
	};
};
