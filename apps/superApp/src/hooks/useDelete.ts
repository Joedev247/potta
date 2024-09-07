import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteAPI } from "../utils/generic.api"

export const useDelete =()=>{
  const client = useQueryClient()
  const mutation = useMutation({
      mutationKey:["Delete"],
      mutationFn:deleteAPI,
      onSuccess: () => client.invalidateQueries()
  })
  return mutation
}