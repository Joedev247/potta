import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfileAPI } from "../utils/api"

export const useUpdateProfile =()=>{
    const client = useQueryClient()
    const mutation = useMutation({
        mutationKey:["UpdateProfile"],
        mutationFn:updateProfileAPI,
        onSuccess:()=> client.invalidateQueries()
    })
    return mutation
}