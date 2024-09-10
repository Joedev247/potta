import { useQuery } from "@tanstack/react-query"
import { getFileAPI } from "../utils/generic.api"

export const useGetUploadFile =(name?:string)=>{
  const query = useQuery({
      queryKey:["UploadFile"],
      queryFn:()=>getFileAPI(name as string),
      enabled: Boolean(name),
  })
  return query
}