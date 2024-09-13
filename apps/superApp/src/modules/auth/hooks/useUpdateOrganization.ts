import { useMutation } from "@tanstack/react-query"
import { updateOrganizationAPI } from "../utils/api"

export const useUpdateOrganization =()=>{
    const mutation = useMutation({
        mutationKey:["UpdateOrganization"],
        mutationFn:updateOrganizationAPI,
        onSuccess:()=> localStorage.clear()
    })
    return mutation
}