import { SingleValue } from "react-select"

export interface IAuthContext {
	user?: IUser
	isAdmin: boolean
	isLoading: boolean
	setUser?: (arg?: IUser) => void
	setIsAdmin?: (arg: boolean) => void
}

export interface IUser {
	created_at: Date
	deleted_at: null | Date
	name: string
	email: string
	lastName: string
	firstName: string
	country:string
}

export type SelectProp = SingleValue<{
  value: string;
  label: string;
}>;