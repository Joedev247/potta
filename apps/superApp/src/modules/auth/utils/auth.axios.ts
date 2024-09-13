import CryptoJS from "crypto-js"
import Axios, { AxiosRequestConfig } from "axios";
import { SECRET, API_URL } from "@instanvi/utilities"

const authAxios = Axios.create({ baseURL: API_URL })

const authRequestInterceptor = async (
	config: AxiosRequestConfig
): Promise<any> => {
	const storage = await localStorage.getItem("authtoken")
	config.headers = { ...config.headers }

	if (storage) {
		const decrypt = CryptoJS.AES.decrypt(storage, SECRET)
		const token = decrypt.toString(CryptoJS.enc.Utf8)
		config.headers.authorization = `Bearer ${token}`
	}

	config.headers.Accept = "application/json"
	return config
}

authAxios.interceptors.request.use(authRequestInterceptor)
authAxios.interceptors.response.use(
	(response) => {
		const status = response?.status
		if ([200, 201].includes(status)) {
			return response?.data // use optional chaining to avoid errors if the data doesn't exist
		} 
		else if (status === 401) {
			localStorage.clear()

			// const storage = localStorage.getItem("refresh")
		
			// if (storage) {
			// 	const decrypt = CryptoJS.AES.decrypt(storage, SECRET)
			// 	const token = decrypt.toString(CryptoJS.enc.Utf8)
			// 	refreshTokenAPI(token)
			// 	.then((data) => {
			// 		// const usertoken = data?.access_token 
			//     // const token =  CryptoJS.AES.encrypt(usertoken, SECRET)
			//     // const refreshtoken =  CryptoJS.AES.encrypt(data?.refresh_token, SECRET)
			//     // localStorage.setItem("token", token.toString())
			//     // localStorage.setItem("refresh", refreshtoken.toString())
			// 		const usertoken = data?.access_token 
			//     const refreshtoken =  data?.refresh_token
			//     encryptAndStore("token", usertoken)
			//     encryptAndStore("refresh", refreshtoken)
			// 	})
			// 	.catch(()=>{
			// 		localStorage.clear()
			// 	})
			// }

		}
		 else {
			return "pas de donnees disponible" // return a string instead of throwing an error
		}
	},
	(error) => {
		if (error?.response?.status === 401) {
			localStorage.clear()
			// const storage = localStorage.getItem("refresh")
		
			// if (storage) {
			// 	const decrypt = CryptoJS.AES.decrypt(storage, SECRET)
			// 	const token = decrypt.toString(CryptoJS.enc.Utf8)
			// 	refreshTokenAPI(token)
			// 	.then((data) => {
			// 		const usertoken = data?.access_token 
			//     const refreshtoken =  data?.refresh_token
			//     encryptAndStore("token", usertoken)
			//     encryptAndStore("refresh", refreshtoken)
			// 	})
			// 	.catch(()=>{
			// 		localStorage.clear()
			// 	})
			// }
		}
		return Promise.reject(error)
	}
)

export default authAxios
