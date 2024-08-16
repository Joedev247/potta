import CryptoJS from "crypto-js"
import Axios, { AxiosRequestConfig } from "axios";
import { API_URL, SECRET } from "./env";

const axios = Axios.create({ baseURL: API_URL })

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
			localStorage.clear()
		} else {
			return "pas de donnees disponible" // return a string instead of throwing an error
		}
	},
	(error) => {
		if (error?.response?.status === 401) {
			localStorage.clear()
		}
		return Promise.reject(error)
	}
)

export default axios
