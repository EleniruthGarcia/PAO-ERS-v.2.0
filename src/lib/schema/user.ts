import z from 'zod';

export const role = ['Administrator', 'Lawyer', 'Staff'] as const;

export const sex = ['Male', 'Female'] as const;

export const civilStatus = ['Single', 'Married', 'Separated', 'Widowed'] as const;

export const status = ['New', 'Updated', 'Archived', 'Restored'] as const;

export const rank = [
	'Chief Public Attorney',
	'Deputy Chief Public Attorney',
	'Public Attorney V',
	'Public Attorney IV',
	'Public Attorney III',
	'Public Attorney II',
	'Public Attorney I',
	'Associate Public Attorney II',
	'Associate Public Attorney I',
	'Administrative Staff',
	'Intern'
] as const;

export const formSchema = z.object({
	_id: z.string(),
	role: z.enum(role),
	branch_id: z.string().min(1, 'Branch is required!'),
	username: z.string().min(1, 'Username is required!'),
	password: z.string().min(1, 'Password is required!'),
	confirmPassword: z.string().min(1, 'Confirm password is required!'),
	hashedPassword: z.string().min(1, 'Hashed password is required!'),
	rank: z.enum(rank),
	name: z.string().min(1, 'Name is required!'),
	firstName: z.string().min(1, 'First name is required!'),
	middleName: z.string().optional(),
	lastName: z.string().min(1, 'Last name is required!'),
	nameSuffix: z.string().optional(),
	dateOfBirth: z.date({
		invalid_type_error: 'Date of birth is required!',
		required_error: 'Date of birth is required!'
	}),
	sex: z.enum(sex),
	address: z.string().min(1, 'Address is required!'),
	email: z.string().email().optional(),
	contactNumber: z
		.string()
		.regex(/^(?=\s*$)|(09|\+639)\d{9}$/, 'Invalid contact number!')
		.refine((value) => value !== '', {
			message: 'Contact number is required!'
		}),
	currentStatus: z.enum(status),
	status: z.array(
		z.object({
			type: z.enum(status),
			date: z.date()
		})
	),
	reportsTo: z.string().optional()
});

export type FormSchema = typeof formSchema;

const userSchema = formSchema.omit({ password: true, confirmPassword: true });
export type User = z.infer<typeof userSchema>;
