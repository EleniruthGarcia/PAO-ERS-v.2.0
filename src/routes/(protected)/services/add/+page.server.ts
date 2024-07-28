import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import db from '$lib/server/database';

import { formSchema } from '$lib/schema/service';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		event.cookies.set('redirect', event.url.pathname, { path: '/' });
		redirect(
			'/login',
			{ type: 'warning', message: 'You must be logged in to access this page!' },
			event
		);
	}

	return {
		breadcrumbs: [
			{ href: '/', text: 'PAO-ERS' },
			{ href: '/services', text: 'Services' },
			{ href: '/services/add', text: 'Add Service' }
		],
		form: await superValidate(
			{
				currentStatus: 'New',
				status: [{ type: 'New', date: new Date() }],
				lawyer_id: event.locals.user.id,
			},
			zod(formSchema),
			{ errors: false }
		),
		lawyers: await db.users.find().toArray(),
		clients: await db.clients.find().toArray(),
		cases: await db.cases.find().toArray(),
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			event.cookies.set('redirect', event.url.pathname, { path: '/' });
			redirect(
				'/login',
				{ type: 'warning', message: 'You must be logged in to access this page!' },
				event
			);
		}

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		const branch = await db.branches.findOne({ _id: event.locals.user.branch_id });

		if (form.data.nature.includes('Barangay Outreach') && !form.data.barangay)
			return setError(form, 'barangay', 'Barangay is required.');

		if (form.data.nature.includes('Barangay Outreach') && !form.data.problemsPresented)
			return setError(form, 'problemsPresented', 'Problems Presented is required.');

		if (form.data.nature.includes('Barangay Outreach') && !form.data.activitiesUndertaken)
			return setError(form, 'activitiesUndertaken', 'Activities Undertaken is required.');

		if (form.data.nature.includes('Barangay Outreach') && !form.data.beneficiary)
			return setError(form, 'Beneficiary is required.');

		let client_id = form.data.client_id;

		for (const beneficiary of form.data.beneficiary) {
			const client = await db.clients.findOne({
				name: beneficiary.name,
				address: beneficiary.address,
			});
			client_id.push(client?._id ?? (await db.clients.insertOne({
				...beneficiary,
				_id: String((await db.clients.countDocuments()) + 1),
				currentStatus: 'New',
				status: [{ type: 'New', date: new Date() }],
				firstName: beneficiary.name.split(' ')[0],
				lastName: beneficiary.name.split(' ')[1],
				civilStatus: 'Single',
				contactNumber: '',
				detained: false,
				educationalAttainment: 'No Formal Schooling',
			})).insertedId);
		};

		const service = await db.services.insertOne({
			...form.data,
			client_id,
			// _id: `${branch?.region}:${branch?.district}:${new Date().getFullYear()}:${new Date().getMonth()}:${(await db.counters.findOneAndUpdate({ _id: 'services', branch_id: branch?._id }, { $inc: { count: 1 } }, { upsert: true }))?.count}`
			_id: `${branch?._id}:${new Date().getFullYear()}:${String(new Date().getMonth()).padStart(2, '0')}:${String((await db.counters.findOneAndUpdate({ _id: `services_${branch?._id}` }, { $inc: { count: 1 } }, { upsert: true }))?.count ?? 0).padStart(6, '0')}`
		});
		if (!service.acknowledged) return fail(500, { form });

		redirect(
			'/services/' + service.insertedId,
			{ type: 'success', message: 'Service added successfully!' },
			event
		);
	}
};
