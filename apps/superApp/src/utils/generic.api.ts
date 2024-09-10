import axios from "@instanvi/utilities";

export const deleteAPI = async (url:string): Promise<unknown> => {
  const response = await axios.delete(url)
  return response?.data;
}

export const uploadFileAPI = async (file:FormData): Promise<unknown> => {
  const response = await axios.post("/files", file)
  return response?.data;
}

export const getFileAPI = async (name:string): Promise<unknown> => {
  const response = await axios.get(`/files${name}`)
  return response?.data;
}

// export const deleteFileAPI = async (name:string): Promise<unknown> => {
//   const response = await axios.delete(`/files${name}`)
//   return response?.data;
// }