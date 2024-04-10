import z from 'zod';

export const formSchema = z.object({
	month: z.string().min(1, 'Month is required!'),
	year: z.string().min(1, 'Year is required!'),
	notedBy: z.string().min(1, 'Noted by is required!'),
});

export type FormSchema = typeof formSchema;
