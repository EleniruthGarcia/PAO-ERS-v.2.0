import db from '$lib/server/database';
import { generateInterviewSheet } from '$lib/server/interview_sheet';

import { fail } from '@sveltejs/kit';
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

	const _case = await db.cases.findOne({ _id: event.params.id });
	if (!_case) redirect('/cases', { type: 'warning', message: 'Case not found!' }, event);

	const request = await db.requests.findOne({ case_id: event.params.id });
	if (!request) redirect('/cases', { type: 'warning', message: 'Request not found!' }, event);

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
		request
	};
};
