import { useMutation } from "@tanstack/react-query"
import { changePasswordAPI } from "../utils/api"

export const useUpdatePassword =()=>{
    const mutation = useMutation({
        mutationKey:["UpdatePassword"],
        mutationFn:changePasswordAPI
    })
    return mutation
}
