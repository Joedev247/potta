import CryptoJS from "crypto-js"
import Axios, { AxiosRequestConfig } from "axios";
import { API_URL, SECRET } from "./env";
import { encryptAndStore } from "../helpers";

const axios = Axios.create({ baseURL: API_URL })

export const refreshTokenAPI = async (refresh_token:string):Promise<{access_token:string,refresh_token:string}> =>{
  const response = await axios.post(`/auth/refresh_token/`, {refresh_token})
   return response?.data;
}

const authRequestInterceptor = async (
	config: AxiosRequestConfig
): Promise<any> => {
	const storage = await localStorage.getItem("token")
	config.headers = { ...config.headers }

	if (storage) {
		const decrypt = CryptoJS.AES.decrypt(storage, SECRET)
		const token = decrypt.toString(CryptoJS.enc.Utf8)
		config.headers.authorization = `Bearer ${token}`
	}

	config.headers.Accept = "application/json"
	return config
}

axios.interceptors.request.use(authRequestInterceptor)
axios.interceptors.response.use(
	(response) => {
		const status = response?.status
		if ([200, 201].includes(status)) {
			return response?.data // use optional chaining to avoid errors if the data doesn't exist
		} else if (status === 401) {
			const storage = localStorage.getItem("refresh")
		
			if (storage) {
				const decrypt = CryptoJS.AES.decrypt(storage, SECRET)
				const token = decrypt.toString(CryptoJS.enc.Utf8)
				refreshTokenAPI(token)
				.then((data) => {
					// const usertoken = data?.access_token 
			    // const token =  CryptoJS.AES.encrypt(usertoken, SECRET)
			    // const refreshtoken =  CryptoJS.AES.encrypt(data?.refresh_token, SECRET)
			    // localStorage.setItem("token", token.toString())
			    // localStorage.setItem("refresh", refreshtoken.toString())
					const usertoken = data?.access_token 
			    const refreshtoken =  data?.refresh_token
			    encryptAndStore("token", usertoken)
			    encryptAndStore("refresh", refreshtoken)
				})
				.catch(()=>{
					localStorage.clear()
				})
			}

		} else {
			return "pas de donnees disponible" // return a string instead of throwing an error
		}
	},
	(error) => {
		if (error?.response?.status === 401) {
			const storage = localStorage.getItem("refresh")
		
			if (storage) {
				const decrypt = CryptoJS.AES.decrypt(storage, SECRET)
				const token = decrypt.toString(CryptoJS.enc.Utf8)
				refreshTokenAPI(token)
				.then((data) => {
					const usertoken = data?.access_token 
			    const refreshtoken =  data?.refresh_token
			    encryptAndStore("token", usertoken)
			    encryptAndStore("refresh", refreshtoken)
				})
				.catch(()=>{
					localStorage.clear()
				})
			}
		}
		return Promise.reject(error)
	}
)

export default axios
