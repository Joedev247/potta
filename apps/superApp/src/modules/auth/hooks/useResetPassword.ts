import { useMutation } from "@tanstack/react-query"
import { resetPasswordAPI } from "../utils/api"

export const useResetPassword =()=>{
    const mutation = useMutation({
        mutationKey:["ResetPassword"],
        mutationFn:resetPasswordAPI
    })
    return mutation
}