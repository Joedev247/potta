import { SingleValue } from "react-select"
import { IOrganisation } from "../modules/auth/utils/types"

export interface IAuthContext {
	user?: IUser
	isAdmin: boolean
	isLoading: boolean
	setUser?: (arg?: IUser) => void
	setIsAdmin?: (arg: boolean) => void
}
export type Role = {
	id:string
	name:string
}

export interface IUser {
	name: string
	roles: Role[]
	email: string
	country:string
	enabled: boolean
	lastName: string
	firstName: string
	access_token: string
	refresh_token: string
	organization: IOrganisation | null
}

export type SelectProp = SingleValue<{
  value: string;
  label: string;
}>;