import * as yup from "yup"

export const loginSchema = yup.object({
	email:yup.string().email().required(),
	password:yup.string().required(),
})


export const emailSchema = yup.object({
	email:yup.string().email().required()
})

export const registerSchema = yup.object({
	firstName:yup.string(),
	lastName:yup.string(),
	email:yup.string().email().required(),
	password: yup
    .string()
    .required('Password is required')
    .matches(
      /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Password must contain at least one uppercase letter and one special character'
    ),
	country:yup.string().required(),
	// name:yup.string().required(),
})

export const profileSchema = yup.object({
	name:yup.string().required(),
	city:yup.string().required(),
	email:yup.string().email().required(),
	about:yup.string().required(),
	address:yup.string().required(),
	country:yup.string().required(),
	lastName:yup.string().required(),
	postcode:yup.string().required(),
	firstName:yup.string().required(),
	language:yup.string().required(),
})

export const organizationSchema = yup.object({

	name:yup.string().required(),
	city:yup.string().required(),
	state:yup.string().required(),
	phone:yup.string().required(),
	address:yup.string().required(),
	country:yup.string().required(),
	industry:yup.string().required(),
	postcode:yup.number().required(),
	description:yup.string().required(),
	website:yup.string().url().required(),
	activity_type:yup.string().required(),
	email:yup.string().email().required(),
	count_of_employees_max:yup.number().required(),
	count_of_employees_min:yup.number().required("number of employees must be selected"),
})

export const changePasswordSchema = yup.object({
	password:yup.string().required(),
	new_password:yup.string().matches(
		/^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
		'Password must contain at least one uppercase letter and one special character'
	).required(),
	confirm_password: yup.string()
	.required('Confirm Password is required')
	.oneOf([yup.ref('new_password')], 'Passwords must match')
})

export type LoginData = yup.InferType<typeof loginSchema>
export type EmailData = yup.InferType<typeof emailSchema>
export type ProfileData = yup.InferType<typeof profileSchema>
export type RegisterFormData = yup.InferType<typeof registerSchema>
export type PasswordFormData = yup.InferType<typeof changePasswordSchema>
export type OrganizationFormData = yup.InferType<typeof organizationSchema>
