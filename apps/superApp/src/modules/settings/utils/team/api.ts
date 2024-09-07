import axios from "@instanvi/utilities";
import { MemberFormData } from "./validations";

export const createMemberAPI = async (inputs: MemberFormData): Promise<unknown> => {
  const response = await axios.post("/members/create", inputs)
  return response?.data;
}

export const getMembersAPI = async (): Promise<unknown> => {
  const response = await axios.get("/members")
  return response?.data;
}

export const getSingleMemberAPI = async (id:string): Promise<unknown> => {
  const response = await axios.get(`/members/${id}`)
  return response?.data;
}

export const updateMemberAPI = async (id:string, inputs: MemberFormData): Promise<unknown> => {
  const response = await axios.put(`/members/${id}`, inputs)
  return response?.data;
}

