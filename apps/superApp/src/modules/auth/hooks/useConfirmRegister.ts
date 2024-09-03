import { useMutation, useQueryClient } from "@tanstack/react-query"
import { registerConfirmAPI } from "../utils/api"

export const useConfirmRegister =()=>{
    const client = useQueryClient()
    const mutation = useMutation({
        mutationKey:["ConfirmRegistration"],
        mutationFn:registerConfirmAPI,
        onSuccess:()=> client.invalidateQueries()
    })
    return mutation
}