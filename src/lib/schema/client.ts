import z from 'zod';

export const formSchema = z.object({
	firstName: z.string().min(1).max(50),
	middleName: z.string().min(1).max(50).optional(),
	lastName: z.string().min(1).max(50),
	nameSuffix: z.string().min(1).max(50).optional(),
	age: z.number().int(),
	sex: z.enum(['male', 'female']),
	address: z.string().min(1).max(100),
	email: z.string().email().optional(),
	contactNumber: z.number().min(11).max(11).optional(),
	civilStatus: z.enum(['single', 'married', 'widowed', 'separated']),
	religion: z.string().min(1).max(50).optional(),
	citizenship: z.string().min(1).max(50),
	educationalAttainment: z.string().min(1).max(50),
	language: z.string().min(1).max(50),
	individualMonthlyIncome: z.number().optional(),
	detained: z.boolean(),
	detainedAt: z.string().min(1).max(100).optional(),
	detainedSince: z.date().optional(),
	spouseName: z.string().min(1).max(50).optional(),
	spouseAddress: z.string().min(1).max(100).optional(),
	spouseContactNumber: z.number().min(11).max(11).optional()
});

export type FormSchema = typeof formSchema;
