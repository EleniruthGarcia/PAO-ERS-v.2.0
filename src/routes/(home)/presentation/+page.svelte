<script lang="ts">
	import { SelectedClients } from '$lib/components/tables/client';

	import * as Card from '$lib/components/ui/card';
	import NightToggle from '$lib/components/NightToggle.svelte';
	import { Separator } from '$lib/components/ui/separator';

	import * as Avatar from '$lib/components/ui/avatar';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	const selectedClients = writable({});
	setContext('selectedClients', selectedClients);
</script>

<main class="grid gap-4">
	<div class="mx-auto grid max-w-[64rem] flex-1 auto-rows-max gap-4">
		<Card.Root>
			<Card.Header>
				<Card.Title>Introduction</Card.Title>
			</Card.Header>
			<Card.Content class="flex auto-rows-max flex-col items-center gap-3 px-12 pb-12 lg:px-24">
				<img
					src="/favicon.png"
					alt="PAO-ERS Logo"
					class="aspect-square w-32 [view-transition-name:logo] sm:w-40 md:w-48"
				/>
				<span class="text-center">
					<h1 class="text-xl font-bold sm:text-2xl md:text-4xl">Public Attorney's Office</h1>
					<h2 class="text-l font-semibold text-primary sm:text-xl md:text-3xl">
						Electronic Records System
					</h2>
				</span>
				<p class="text-center text-xs sm:text-sm md:text-base">
					The Public Attorney’s Office - Electronic Records System (PAO-ERS) is a web-based
					application that aims to provide a more efficient and effective way of managing records
					and cases of the Public Attorney’s Office. It is designed to be user-friendly and
					accessible to all PAO personnel.
				</p>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>Developer Team</Card.Title>
			</Card.Header>
			<Card.Content class="grid auto-rows-max items-start justify-center gap-3 pb-12">
				<div class="grid gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-4">
					<div class="border-1 flex items-center gap-4 rounded-md border p-4">
						<Avatar.Root>
							<Avatar.Image
								src="https://scontent.cdninstagram.com/v/t51.2885-19/434695257_1380886895897660_7480150391130763231_n.jpg?_nc_ht=scontent.cdninstagram.com&_nc_cat=108&_nc_ohc=jqgQUiXGtNkAb4QpKyl&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfDwFiGrOPg_EEoIMdunzVUw6wH0wOS0aYyIpWscQfa1QQ&oe=661DBDA9&_nc_sid=10d13b"
								alt="@shadcn"
							/>
							<Avatar.Fallback>JG</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex flex-col">
							<span class="font-bold">Jude Gatchalian</span>
							<span class="text-sm text-muted-foreground">Project Manager</span>
						</div>
					</div>
					<div class="border-1 flex items-center gap-4 rounded-md border p-4">
						<Avatar.Root>
							<Avatar.Image
								src="https://scontent.cdninstagram.com/v/t51.2885-19/416080657_191854717349011_6773820498928470338_n.jpg?_nc_ht=scontent.cdninstagram.com&_nc_cat=107&_nc_ohc=vGYY-cDOBWMAb5zmDw6&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfDaO1nok4uKz8hsuniriiNtNftBZ2eurV_RkYVgURd6AA&oe=661DB194&_nc_sid=10d13b"
								alt="@shadcn"
							/>
							<Avatar.Fallback>DB</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex flex-col">
							<span class="font-bold">Daniel Bador</span>
							<span class="text-sm text-muted-foreground">Back-end Developer</span>
						</div>
					</div>
					<div class="border-1 flex items-center gap-4 rounded-md border p-4">
						<Avatar.Root>
							<Avatar.Image
								src="https://scontent.cdninstagram.com/v/t51.2885-19/326571776_203388555551720_8229853915859029301_n.jpg?_nc_ht=scontent.cdninstagram.com&_nc_cat=108&_nc_ohc=4IQIxJXsOYQAb5_miWY&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfAdHHpwvBWtHv-ZySHB4nTAdb6XNofONbIFOAoAHmUi2Q&oe=661D9FF1&_nc_sid=10d13b"
								alt="@shadcn"
							/>
							<Avatar.Fallback>RB</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex flex-col">
							<span class="font-bold">Rance Bobadilla</span>
							<span class="text-sm text-muted-foreground">Back-end Developer</span>
						</div>
					</div>
					<div class="border-1 flex items-center gap-4 rounded-md border p-4">
						<Avatar.Root>
							<Avatar.Image
								src="https://scontent-mnl1-1.cdninstagram.com/v/t51.2885-19/413338935_922405739269869_4590117888755648847_n.jpg?stp=dst-jpg_s320x320&_nc_ht=scontent-mnl1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=RySWv0aW6TUAb5g8ou3&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfDt6HOD2vls8dLK2ZldbaYqODh8R-Zes7Q9G6_oQ4-Xng&oe=661D9F6A&_nc_sid=8b3546"
								alt="@shadcn"
							/>
							<Avatar.Fallback>LR</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex flex-col">
							<span class="font-bold">Lance Rimando</span>
							<span class="text-sm text-muted-foreground">UI/UX Developer</span>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>Summary of Customer Priorities</Card.Title>
			</Card.Header>
			<Card.Content
				class="grid auto-rows-max items-start justify-center gap-3 px-12 pb-12 md:px-24"
			>
				<p>
					In summary, the main requirement of the customer is a working database system with
					integrated form generation, account systems, and report generation.
				</p>
				<ul class="list-disc">
					<li>
						<strong>Form generation and secure database:</strong>
						The PAO-ERS should be able to generate forms, read, and store client inputs to be transmitted
						to the database. On top of this, the system should be able to safely and securely store the
						client data and should be resistant to data leaks.
					</li>
					<li>
						<strong>Software compatibility with the hardware:</strong>
						The system should be able to run on the hardware or devices of the clients. This is important
						to avoid future expenditures on equipment and to ensure fast integration of the software
						into the current system.
					</li>
					<li>
						<strong>Account systems:</strong>
						The system should also have account systems that show each user their respective analytics
						on their accounts. The account systems should also include a log-in system to ensure a more
						secure environment for client data.
					</li>
					<li>
						<strong>Fast report generation:</strong>
						The system should also be able to instantaneously generate reports needed by the users monthly.
						These reports will be automatically downloaded to the computer or device with a click of
						a button.
					</li>
					<li>
						<strong>System manual and documentation:</strong>
						The system should come with an instruction manual on how to use the system to properly notify
						and educate the users on the features of the system. This is to ensure proper and immediate
						migration from the current system to the digitized PAO-ERS. The documentation is important
						in case of future updates or improvements of the system.
					</li>
				</ul>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>Maintenance Services</Card.Title>
			</Card.Header>
			<Card.Content
				class="grid auto-rows-max items-start justify-center gap-3 px-12 pb-12 md:px-24"
			>
				<p>
					The developers agree to provide the following maintenance services, until the graduation
					of the developers:
				</p>
				<ul class="list-disc">
					<li>
						<strong>Error Correction:</strong>
						The developers will make reasonable efforts to identify and fix bugs and errors that may
						arise in the system's operation, ensuring its functionality within intended parameters.
					</li>
					<li>
						<strong>Longevity of Service:</strong>
						The developers will perform routine maintenance tasks to ensure the system's continued operation
						and prevent potential issues that could affect its lifespan.
					</li>
				</ul>
				<Separator />
				<p>
					<strong>Scaling:</strong>
					The developers' commitment to provide free maintenance services is limited to the current scope
					and functionality of the system. Any future requests to scale the system's operations, add
					new features, or modify existing functionalities will be subject to the developers' availability,
					resources, and mutual agreement with PAO Cordillera Administrative Region (CAR). The developers
					are not obligated to fulfill such requests but will engage in good faith discussions with PAO
					CAR regarding feasibility and potential costs.
				</p>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<div class="flex">
					<div class="mr-auto flex flex-col space-y-1.5">
						<Card.Title>Colors</Card.Title>
						<Card.Description>These are the colors used for the website.</Card.Description>
					</div>
					<NightToggle />
				</div>
			</Card.Header>
			<Card.Content class="grid auto-rows-max items-start justify-center gap-3 px-24 pb-12">
				<div class="grid gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-5">
					<div class="border-1 grid rounded-md border p-4">
						<div class="mb-2 h-32 w-full border-2 bg-[#F9FAFA]"></div>
						<span class="font-bold">Oath</span>
						<span class="text-sm">#F9FAFA</span>
						<span class="text-xs text-muted-foreground">RGB(249, 250, 250)</span>
					</div>
					<div class="border-1 grid rounded-md border p-4">
						<div class="mb-2 h-32 w-full border-2 bg-[#F4F4F5]"></div>
						<span class="font-bold">Innocence</span>
						<span class="text-sm">#F4F4F5</span>
						<span class="text-xs text-muted-foreground">RGB(244, 245, 245)</span>
					</div>
					<div class="border-1 grid rounded-md border p-4">
						<div class="mb-2 h-32 w-full border-2 bg-[#7B9D84]"></div>
						<span class="font-bold">Trust</span>
						<span class="text-sm">#7B9D84</span>
						<span class="text-xs text-muted-foreground">RGB(123, 157, 132)</span>
					</div>
					<div class="border-1 grid rounded-md border p-4">
						<div class="mb-2 h-32 w-full border-2 bg-[#325B67]"></div>
						<span class="font-bold">Equity</span>
						<span class="text-sm">#325B67</span>
						<span class="text-xs text-muted-foreground">RGB(50, 91, 103)</span>
					</div>
					<div class="border-1 grid rounded-md border p-4">
						<div class="mb-2 h-32 w-full border-2 bg-[#2C2E44]"></div>
						<span class="font-bold">Diligence</span>
						<span class="text-sm">#2C2E44</span>
						<span class="text-xs text-muted-foreground">RGB(44, 46, 48)</span>
					</div>
				</div>
				<div class="invisible grid grid-cols-11 gap-3 sm:visible">
					<span class="col-span-2 text-xs">Background</span>
					<div class="col-span-3 flex lg:gap-4">
						<div class="h-6 w-6 border-2 bg-background"></div>
						<div class="h-6 w-6 border-2 bg-background/90"></div>
						<div class="h-6 w-6 border-2 bg-background/80"></div>
						<div class="h-6 w-6 border-2 bg-background/70"></div>
						<div class="h-6 w-6 border-2 bg-background/60"></div>
						<div class="h-6 w-6 border-2 bg-background/50"></div>
					</div>
					<div></div>
					<span class="col-span-2 text-xs">Foreground</span>
					<div class="col-span-3 flex lg:gap-4">
						<div class="h-6 w-6 border-2 bg-foreground"></div>
						<div class="h-6 w-6 border-2 bg-foreground/90"></div>
						<div class="h-6 w-6 border-2 bg-foreground/80"></div>
						<div class="h-6 w-6 border-2 bg-foreground/70"></div>
						<div class="h-6 w-6 border-2 bg-foreground/60"></div>
						<div class="h-6 w-6 border-2 bg-foreground/50"></div>
					</div>
					<span class="col-span-2 text-xs">Primary</span>
					<div class="col-span-3 flex lg:gap-4">
						<div class="h-6 w-6 border-2 bg-primary"></div>
						<div class="h-6 w-6 border-2 bg-primary/90"></div>
						<div class="h-6 w-6 border-2 bg-primary/80"></div>
						<div class="h-6 w-6 border-2 bg-primary/70"></div>
						<div class="h-6 w-6 border-2 bg-primary/60"></div>
						<div class="h-6 w-6 border-2 bg-primary/50"></div>
					</div>
					<div></div>
					<span class="col-span-2 text-xs">Secondary</span>
					<div class="col-span-3 flex lg:gap-4">
						<div class="h-6 w-6 border-2 bg-secondary"></div>
						<div class="h-6 w-6 border-2 bg-secondary/90"></div>
						<div class="h-6 w-6 border-2 bg-secondary/80"></div>
						<div class="h-6 w-6 border-2 bg-secondary/70"></div>
						<div class="h-6 w-6 border-2 bg-secondary/60"></div>
						<div class="h-6 w-6 border-2 bg-secondary/50"></div>
					</div>
					<span class="col-span-2 text-xs">Muted</span>
					<div class="col-span-3 flex lg:gap-4">
						<div class="h-6 w-6 border-2 bg-muted"></div>
						<div class="h-6 w-6 border-2 bg-muted/90"></div>
						<div class="h-6 w-6 border-2 bg-muted/80"></div>
						<div class="h-6 w-6 border-2 bg-muted/70"></div>
						<div class="h-6 w-6 border-2 bg-muted/60"></div>
						<div class="h-6 w-6 border-2 bg-muted/50"></div>
					</div>
					<div></div>
					<span class="col-span-2 text-xs">Destructive</span>
					<div class="col-span-3 flex lg:gap-4">
						<div class="h-6 w-6 border-2 bg-destructive"></div>
						<div class="h-6 w-6 border-2 bg-destructive/90"></div>
						<div class="h-6 w-6 border-2 bg-destructive/80"></div>
						<div class="h-6 w-6 border-2 bg-destructive/70"></div>
						<div class="h-6 w-6 border-2 bg-destructive/60"></div>
						<div class="h-6 w-6 border-2 bg-destructive/50"></div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
	{#if Object.entries($selectedClients).length > 0}
		<div>
			<SelectedClients />
		</div>
	{/if}
</main>
