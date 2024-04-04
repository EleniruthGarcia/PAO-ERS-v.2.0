import { z } from 'zod';

export const formSchema = z.object({
    dob: z.string().refine((v) => v, { message: 'A date of birth is required.' })
});

export type FormSchema = typeof formSchema;