import { useMutation, useQueryClient } from "@tanstack/react-query"
import { registerAPI } from "../utils/api"

export const useRegister =()=>{
    const client = useQueryClient()
    const mutation = useMutation({
        mutationKey:["Register"],
        mutationFn:registerAPI,
        onSuccess:()=> client.invalidateQueries()
    })
    return mutation
}