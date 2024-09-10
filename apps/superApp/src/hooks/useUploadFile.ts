import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadFileAPI } from "../utils/generic.api"

export const useUploadFile =()=>{
  const client = useQueryClient()
  const mutation = useMutation({
      mutationKey:["UploadFile"],
      mutationFn:uploadFileAPI,
      onSuccess: () => client.invalidateQueries({queryKey:["Upload"]})
  })
  return mutation
}