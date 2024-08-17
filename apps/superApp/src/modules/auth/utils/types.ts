export interface ILogin {
 email:string,
 password:string
}

export interface IChangePassword {
  password:string,
  new_password:string
}

export interface IRegister {
 email:string,
 firstName?:string,
 lastName?:string,
 password:string,
 organization: Partial<IOrganisation>
}

export interface IOrganisation {
  name:string,
  description:string,
  industry:string,
  address:string,
  postcode:string,
  state:string,
  city:string,
  phone:string,
  email:string,
  activity_type:string,
  documents: string[],
  country:string
 }

 export type IndentityProp = Pick<IOrganisation, "activity_type">| null 
 export type BusinessProp = Pick<IOrganisation, "name" | "industry" | "description"> | null 
 export type AddressProp = Omit<IOrganisation, "name" | "industry" | "description" | "activity_type"> | null