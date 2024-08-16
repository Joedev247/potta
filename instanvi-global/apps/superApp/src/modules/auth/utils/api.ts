import { ProfileData } from "./validations";
import axios from "@instanvi-global/utilities";
import { IChangePassword, ILogin, IOrganisation, IRegister } from "./types";

export const registerAPI = async (inputs:IRegister):Promise<unknown> =>{
 const response = await axios.post("/auth/register", inputs)
  return response?.data;
}

export const loginAPI = async (inputs:ILogin):Promise<unknown> =>{
 const response = await axios.post("/auth/login", inputs)
  return response?.data;
}

export const changePasswordAPI = async (inputs:IChangePassword):Promise<unknown> =>{
  const response = await axios.post("/auth/change-password", inputs)
   return response?.data;
}

export const forgotPasswordEmailAPI = async (email:string):Promise<unknown> =>{
 const response = await axios.post(`/auth/forgot-password/email`, {email})
  return response?.data;
}

export const refreshTokenAPI = async (refresh_token:string):Promise<unknown> =>{
  const response = await axios.post(`/auth/refresh_token/`, {refresh_token})
   return response?.data;
}

export const registerConfirmAPI = async (token:string):Promise<unknown> =>{
  const response = await axios.patch(`/auth/register/confirm/${token}`)
   return response?.data;
}

export const updateProfileAPI = async (inputs:ProfileData):Promise<unknown> =>{
  const response = await axios.put("/auth/update-profile", inputs)
   return response?.data;
}

export const updateOrganizationAPI = async (inputs:IOrganisation):Promise<unknown> =>{
  const response = await axios.put("/auth/update-organization", inputs)
   return response?.data;
}

export const resetPasswordConfirmAPI = async (code:string):Promise<unknown> =>{
 const response = await axios.patch(`/auth/reset-password/code/${code}`)
  return response?.data;
}

export const resetPasswordAPI = async (token:string):Promise<unknown> =>{
 const response = await axios.patch(`/auth/reset-password/reset/${token}`)
  return response?.data;
}

export const meAPI = async ():Promise<unknown> =>{
 const response = await axios.get("/auth/me")
  return response?.data;
}

export const logoutAPI = async ():Promise<unknown> =>{
  const response = await axios.post("/auth/logout")
   return response?.data;
 }

