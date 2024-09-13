import { useMutation } from "@tanstack/react-query"
import { registerConfirmAPI } from "../utils/api"
import { SECRET } from "@instanvi/utilities"

export const useConfirmRegister =()=>{
    const mutation = useMutation({
        mutationKey:["ConfirmRegistration"],
        mutationFn:registerConfirmAPI,
        onSuccess: (data) => {
			const usertoken = data?.access_token 
			// const refreshtoken = data?.refresh_token 
			const token = CryptoJS.AES.encrypt(usertoken, SECRET)
			localStorage.setItem("authtoken", String(token))
			// await localStorage.setItem("refreshtoken", refreshtoken.toString())
            // encryptAndStore("token",usertoken)
            // encryptAndStore("refresh",refreshtoken)
		},
    })
    return mutation
}