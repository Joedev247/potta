// import CryptoJS from "crypto-js"
import { useMutation } from "@tanstack/react-query"
import { loginAPI } from "../utils/api"
import { encryptAndStore } from "@instanvi/utilities"

export const useLogin =()=>{
    const mutation = useMutation({
        mutationKey:["Login"],
        mutationFn:loginAPI,
        onSuccess: async (data) => {
			const usertoken = data?.access_token 
			const refreshtoken = data?.refresh_token 
			// const token = await CryptoJS.AES.encrypt(usertoken, SECRET)
			// await localStorage.setItem("token", token.toString())
			// await localStorage.setItem("refreshtoken", refreshtoken.toString())
            encryptAndStore("token",usertoken)
            encryptAndStore("refresh",refreshtoken)
		},
    })
    
    return mutation
}