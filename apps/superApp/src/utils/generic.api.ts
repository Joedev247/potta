import axios from "@instanvi/utilities";

export const deleteAPI = async (url:string): Promise<unknown> => {
  const response = await axios.delete(url)
  return response?.data;
}