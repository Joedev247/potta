import { useMutation } from "@tanstack/react-query"
import {resetPasswordConfirmAPI } from "../utils/api"

export const useResetPasswordConfirm =()=>{
    const mutation = useMutation({
        mutationKey:["ResetPasswordConfirm"],
        mutationFn:resetPasswordConfirmAPI
    })
    return mutation
}