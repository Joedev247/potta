import { useMutation } from "@tanstack/react-query"
import {changePasswordConfirmAPI } from "../utils/api"

export const useChangePasswordConfirm =()=>{
    const mutation = useMutation({
        mutationKey:["ChangePasswordConfirm"],
        mutationFn:changePasswordConfirmAPI
    })
    return mutation
}