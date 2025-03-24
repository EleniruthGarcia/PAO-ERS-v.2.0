import z from 'zod';

export const role = ['Administrator', 'Lawyer', 'Staff'] as const;

export const rank = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'N/A'] as const;

export const sex = ['Male', 'Female'] as const;

export const civilStatus = ['Single', 'Married', 'Separated', 'Widowed'] as const;

export const status = ['New', 'Updated', 'Archived', 'Restored'] as const;

export const position = [
	'Regional Public Attorney',
	'Assistant Regional Public Attorney',
	'OIC - District Public Attorney',
	'Review Division Head',
	'Public Attorney',
	'Administrative Officer',
	'Administrative Assistant',
	'Administrative Aide',
	'Legal Assistant',
	'Intern'
] as const;

export const formSchema = z.object({
	_id: z.string(),
	role: z.enum(role).default('Staff'),
	branch_id: z.string().min(1, 'Branch is required!'),
	username: z.string().min(1, 'Username is required!'),
	changePassword: z.boolean().default(false),
	password: z.string().optional(),
	confirmPassword: z.string().optional(),
	hashedPassword: z.string().min(1, 'Hashed password is required!'),
	position: z.enum(position),
	rank: z.string().min(1, 'Rank is required!'),
	name: z.string().min(1, 'Name is required!'),
	firstName: z.string().min(1, 'First name is required!'),
	middleName: z.string().optional(),
	lastName: z.string().min(1, 'Last name is required!'),
	nameSuffix: z.string().optional(),
	civilStatus: z.enum(civilStatus),
	// dateOfBirth: z.date({
	// 	invalid_type_error: 'Date of birth is required!',
	// 	required_error: 'Date of birth is required!'
	// }),
	// sex: z.enum(sex),
	// address: z.string().min(1, 'Address is required!'),
	// email: z.string().email().optional(),
	// contactNumber: z
	// 	.string()
	// 	.regex(/^(?=\s*$)|(09|\+639)\d{9}$/, 'Invalid contact number!')
	// 	.refine((value) => value !== '', {
	// 		message: 'Contact number is required!'
	// 	}),
	currentStatus: z.enum(status),
	status: z.array(
		z.object({
			type: z.enum(status),
			date: z.date()
		})
	),
	reportsTo: z.string().optional()
}).superRefine((data, ctx) => {
	if (data.password && data.password.length < 8)
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Password must be at least 8 characters!',
			path: ['password']
		});

	if (data.changePassword) {
		if (data.password !== data.confirmPassword)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match!',
				path: ['confirmPassword']
			});
	}
});

export type FormSchema = typeof formSchema;
export type User = z.infer<typeof formSchema>;
