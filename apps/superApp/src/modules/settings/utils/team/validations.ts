import * as yup from "yup"


export const memberSchema = yup.object({
	role:yup.string().required(),
	lastName:yup.string().required(),
	password:yup.string().required(),
	firstName:yup.string().required(),
	email:yup.string().email().required(),

})

export type MemberFormData = yup.InferType<typeof memberSchema>
