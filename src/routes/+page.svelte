<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';
	import SvgIcon from '@jamescoyle/svelte-icon';
	import { mdiPencil } from '@mdi/js';
	import Loading from '$lib/components/Loading.svelte';

	import Logo from '$lib/images/Logo.png';

	export let data: PageServerData;
	export let form: ActionData;

	let time = new Date();

	setInterval(() => (time = new Date()));
</script>

<form id="logout" method="POST" action="/logout" class="hidden" />

{#if $page.data.user}
	<main
		class="h-screen w-screen pt-12 p-6 lg:p-12 lg:pl-14 flex flex-col gap-4 bg-witness text-diligence"
	>
		<div class="hidden md:block fixed top-10 right-10 text-right">
			<p class="font-bold text-diligence text-sm">
				{Intl.DateTimeFormat('en-PH', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
					second: 'numeric'
				}).format(time)}
			</p>
			<p class="text-equity text-sm">
				{Intl.DateTimeFormat('en-PH', { timeZoneName: 'long' })
					.formatToParts(time)
					.find((part) => part.type === 'timeZoneName')?.value}
			</p>
		</div>

		<div class="mb-4 pl-6 lg:pl-0">
			<h2 class="text-diligence font-bold mb-2">Dashboard</h2>
			<p class="font-bold">Welcome to your dashboard.</p>
		</div>
		{#await data.clients}
			<div><Loading /></div>
		{:then clients}
			<div class="grid grid-cols-10 gap-4 max-h-[90%]">
				<div class="flex flex-col gap-4 lg:col-span-7 col-span-10 overflow-y-auto p-2 pt-0">
					<div
						class="flex flex-col gap-4 py-6 rounded-lg border border-innocence bg-witness shadow-md"
					>
						<h4 class="font-bold text-equity px-6">Clients</h4>
						{#if clients.length === 0}
							<p>No clients found!</p>
						{:else}
							<table class="text-left w-full">
								<thead class="w-full">
									<tr class=" px-6 flex w-full border border-0 border-t border-innocence">
										<th class="p-3 w-1/3">Name</th>
										<th class="p-3 w-1/4 text-center">Case Number</th>
										<th class="p-3 w-1/4 text-center">Case Type</th>
										<th class="p-3 w-1/6"></th>
									</tr>
								</thead>
								<tbody class="text-sm flex flex-col overflow-y-scroll w-full h-36">
									{#each clients as client}
										<a href="/clients/{client.id}">
											<tr
												class="h-12 px-6 flex w-full hover:bg-oath border border-0 border-b border-t border-innocence"
											>
												<td class="font-bold p-3 w-1/3">
													<span class="hidden lg:block"
														>{client.firstName +
															' ' +
															client.middleName +
															' ' +
															client.lastName +
															(client.nameSuffix ? ' ' + client.nameSuffix : '')}</span
													>
													<span class="block lg:hidden">{client.lastName}</span>
												</td>
												<td class="p-3 w-1/4 text-center"
													>{client?.caseNumber ? 'Case Number' : 'No Number'}</td
												>
												<td class="p-3 w-1/4 text-center"
													>{client?.caseType ? 'Case Type' : 'No Case'}</td
												>
												<td class="w-1/6 flex items-center justify-end">
													<a href="/clients/{client?.id}/edit"
														><button class="flex gap-2 px-2 lg:px-4"
															><SvgIcon size="15px" type="mdi" path={mdiPencil}></SvgIcon><span
																class="hidden lg:block">Edit</span
															></button
														></a
													>
												</td>
											</tr>
										</a>
									{/each}
								</tbody>
							</table>
						{/if}
						<div class="flex gap-4 px-6">
							<a href="/clients/add"><button class="bg-trust" type="submit">New Client</button></a>
							<a href="/clients/"
								><button class="border border-2 border-diligence" type="button"
									>See All Clients</button
								></a
							>
						</div>
					</div>
				</div>
				<div class="hidden lg:block lg:col-span-3">
					<div class="flex flex-col gap-4 bg-oath p-4 rounded-lg shadow-md">
						<h4 class="font-bold">Analytics</h4>
					</div>
				</div>
			</div>
		{/await}
	</main>
{:else}
	<main class="h-screen w-screen bg-witness text-diligence flex">
		<div
			class="h-screen w-1/2 p-12 hidden lg:flex items-center justify-center flex-col gap-4 bg-verdict text-oath text-center pb-20"
		>
			<img src={Logo} alt="PAO Logo" class="w-8 sm:w-28" />
			<h2 class="font-bold text-oath leading-tight">
				Public Attorney’s Office <br /><span class="text-trust"> Electronic Records System </span>
			</h2>
			<p class="text-sm text-innocence">
				The Public Attorney’s Office - Electronic Records System (PAO-ERS) is a web-based
				application that aims to provide a more efficient and effective way of managing records and
				cases of the Public Attorney’s Office. It is designed to be user-friendly and accessible to
				all PAO personnel.
			</p>
		</div>
		<div class="flex flex-col m-auto p-4 text-center gap-4 pb-14">
			<span class="flex flex-col items-center justify-center">
				<h3 class="text-diligence font-bold">Sign-in</h3>
				<p>Enter your credentials to access your dashboard.</p>
			</span>

			<form method="POST" action="?/login" use:enhance class="flex flex-col w-full gap-5">
				<div class="flex flex-col gap-4 m-auto">
					<span class="flex flex-col gap-1 items-start">
						<label for="username" class="text-sm font-bold">Username</label>
						{#if form?.missing || form?.user || form?.invalid}
							<input
								class="p-2 rounded outline outline-red-400 outline-1 focus:outline-2 focus:outline-equity text-sm w-80"
								id="username"
								name="username"
								type="text"
								placeholder="Username"
								autocomplete="username"
							/>

							{#if form?.user}
								<p class="text-sm text-red-400">Username does not exist.</p>
							{/if}

							{#if form?.username}
								<p class="text-red-400 text-sm">Username is required.</p>
							{/if}

							{#if form?.invalid}
								<p class="text-red-400 text-sm">Invalid username.</p>
							{/if}
						{:else}
							<input
								class="p-2 rounded outline outline-equity outline-1 focus:outline-2 focus:outline-equity text-sm w-80"
								id="username"
								name="username"
								type="text"
								placeholder="Username"
								autocomplete="username"
							/>
						{/if}

						<label for="password" class="text-sm font-bold">Password</label>
						{#if form?.missing || form?.credentials || form?.invalid}
							<input
								class="p-2 rounded outline outline-red-400 outline-1 focus:outline-2 focus:outline-equity text-sm w-80"
								id="password"
								name="password"
								type="password"
								placeholder="Password"
								autocomplete="current-password"
							/>

							{#if form?.credentials}
								<p class="text-sm text-red-400">You have entered the wrong credentials.</p>
							{/if}

							{#if form?.password}
								<p class="text-red-400 text-sm">Password is required.</p>
							{/if}

							{#if form?.invalid}
								<p class="text-red-400 text-sm">Invalid password.</p>
							{/if}
						{:else}
							<input
								class="p-2 rounded outline outline-equity outline-1 focus:outline-2 focus:outline-equity text-sm w-80"
								id="password"
								name="password"
								type="password"
								placeholder="Password"
								autocomplete="current-password"
							/>
						{/if}
					</span>

					<span class="flex items-center justify-between">
						<span class="flex items-center justify-center">
							<input type="checkbox" id="remember" name="remember" class="mr-1 accent-trust" />
							<label for="remember" class="text-sm">Remember me.</label>
						</span>

						<a href="/forgot-password" class="text-sm text-trust">Forgot password?</a>
					</span>

					<button class="bg-trust" type="submit">Sign-in</button>
				</div>
			</form>
		</div>
	</main>
{/if}
