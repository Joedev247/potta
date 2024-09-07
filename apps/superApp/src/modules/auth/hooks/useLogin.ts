import CryptoJS from "crypto-js"
import { useMutation } from "@tanstack/react-query"
import { loginAPI } from "../utils/api"
import { SECRET } from "@instanvi/utilities"

export const useLogin =()=>{
    const mutation = useMutation({
        mutationKey:["Login"],
        mutationFn:loginAPI, 
        onSuccess: (data) => {
			const usertoken = data?.access_token 
			// const refreshtoken = data?.refresh_token 
			const token = CryptoJS.AES.encrypt(usertoken, SECRET)
			localStorage.setItem("token", String(token))
			// await localStorage.setItem("refreshtoken", refreshtoken.toString())
            // encryptAndStore("token",usertoken)
            // encryptAndStore("refresh",refreshtoken)
		},
    })
    
    return mutation
}