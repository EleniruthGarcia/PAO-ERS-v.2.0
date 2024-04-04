import { z } from 'zod';

export const formSchema = z.object({
    date: z.string().refine((v) => v, { message: 'A date is required.' })
});

export type FormSchema = typeof formSchema;