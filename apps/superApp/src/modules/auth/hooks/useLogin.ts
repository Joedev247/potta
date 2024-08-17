import CryptoJS from "crypto-js"
import { useMutation } from "@tanstack/react-query"
import { loginAPI } from "../utils/api"
import { SECRET } from "@instanvi/utilities"

export const useLogin =()=>{
    const mutation = useMutation({
        mutationKey:["Login"],
        mutationFn:loginAPI,
        onSuccess: async (data: any) => {
			const usertoken = data?.token 
			const token = await CryptoJS.AES.encrypt(usertoken, SECRET)
			await localStorage.setItem("token", token.toString())
		},
    })
    
    return mutation
}