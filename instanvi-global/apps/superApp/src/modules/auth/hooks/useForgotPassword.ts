import { useMutation } from "@tanstack/react-query"
import { forgotPasswordEmailAPI } from "../utils/api"

export const useForgotPassword =()=>{
    const mutation = useMutation({
        mutationKey:["ForgotPassword"],
        mutationFn:forgotPasswordEmailAPI
    })
    return mutation
}