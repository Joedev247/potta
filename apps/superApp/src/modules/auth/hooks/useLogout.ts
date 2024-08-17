import { useMutation } from "@tanstack/react-query"
import { logoutAPI } from "../utils/api"

export const useLogout =()=>{
    const mutation = useMutation({
        mutationKey:["Logout"],
        mutationFn:logoutAPI,
        onSuccess:()=> {
          localStorage.removeItem("token")
      }
    })
    return mutation
}