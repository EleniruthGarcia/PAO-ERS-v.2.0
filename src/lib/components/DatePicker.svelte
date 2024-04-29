<script lang="ts">
	import { DatePicker } from 'bits-ui';
	import { cn, flyAndScale } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { CaretLeft, CaretRight, Calendar } from 'svelte-radix';
	import { parseDate, type DateValue } from '@internationalized/date';

	let valueString: string;
	export { valueString as value };

	let value: DateValue | undefined = valueString ? parseDate(valueString) : undefined;
	$: value = valueString ? parseDate(valueString) : undefined;
</script>

<DatePicker.Root weekdayFormat="short" fixedWeeks={true} bind:value>
	<div class="flex w-full max-w-[232px] flex-col gap-1.5">
		<DatePicker.Input
			let:segments
			class={cn(
				buttonVariants({ variant: 'outline' }),
				'w-auto justify-between text-left font-normal hover:bg-background',
				!value && 'text-muted-foreground'
			)}
		>
			<span>
				{#each segments as { part, value }}
					<div class="inline-block select-none">
						{#if part === 'literal'}
							<DatePicker.Segment {part} class="p-1 text-muted-foreground">
								{value}
							</DatePicker.Segment>
						{:else}
							<DatePicker.Segment
								{part}
								class="rounded-5px px-1 py-1 hover:bg-muted focus:bg-muted focus:text-foreground focus-visible:!ring-0 focus-visible:!ring-offset-0 aria-[valuetext=Empty]:text-muted-foreground"
							>
								{value}
							</DatePicker.Segment>
						{/if}
					</div>
				{/each}
			</span>
			<DatePicker.Trigger>
				<Calendar class="size-4" />
			</DatePicker.Trigger>
		</DatePicker.Input>
		<DatePicker.Content
			sideOffset={6}
			transition={flyAndScale}
			transitionConfig={{ duration: 150, y: -8 }}
			class="z-50"
		>
			<DatePicker.Calendar
				class="border-dark-10 rounded-[15px] border bg-background p-[22px] shadow-popover"
				let:months
				let:weekdays
			>
				<DatePicker.Header class="flex items-center justify-between">
					<DatePicker.PrevButton
						class="rounded-9px active:scale-98 inline-flex size-10 items-center justify-center bg-background transition-all hover:bg-muted"
					>
						<CaretLeft class="size-6" />
					</DatePicker.PrevButton>
					<DatePicker.Heading class="text-[15px] font-medium" />
					<DatePicker.NextButton
						class="rounded-9px active:scale-98 inline-flex size-10 items-center justify-center bg-background transition-all hover:bg-muted"
					>
						<CaretRight class="size-6" />
					</DatePicker.NextButton>
				</DatePicker.Header>
				<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
					{#each months as month}
						<DatePicker.Grid class="w-full border-collapse select-none space-y-1">
							<DatePicker.GridHead>
								<DatePicker.GridRow class="mb-1 flex w-full justify-between">
									{#each weekdays as day}
										<DatePicker.HeadCell
											class="w-10 rounded-md text-xs !font-normal text-muted-foreground"
										>
											<div>{day.slice(0, 2)}</div>
										</DatePicker.HeadCell>
									{/each}
								</DatePicker.GridRow>
							</DatePicker.GridHead>
							<DatePicker.GridBody>
								{#each month.weeks as weekDates}
									<DatePicker.GridRow class="flex w-full">
										{#each weekDates as date}
											<DatePicker.Cell {date} class="relative size-10 !p-0 text-center text-sm">
												<DatePicker.Day
													{date}
													month={month.value}
													class="rounded-9px group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal text-foreground transition-all hover:border-foreground data-[disabled]:pointer-events-none data-[outside-month]:pointer-events-none data-[selected]:bg-foreground data-[selected]:font-medium data-[disabled]:text-foreground/30 data-[selected]:text-background data-[unavailable]:text-muted-foreground data-[unavailable]:line-through"
												>
													<div
														class="absolute top-[5px] hidden size-1 rounded-full bg-foreground transition-all group-data-[today]:block group-data-[selected]:bg-background"
													/>
													{date.day}
												</DatePicker.Day>
											</DatePicker.Cell>
										{/each}
									</DatePicker.GridRow>
								{/each}
							</DatePicker.GridBody>
						</DatePicker.Grid>
					{/each}
				</div>
			</DatePicker.Calendar>
		</DatePicker.Content>
	</div>
</DatePicker.Root>
