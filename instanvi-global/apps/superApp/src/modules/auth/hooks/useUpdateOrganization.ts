import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateOrganizationAPI } from "../utils/api"

export const useUpdateOrganization =()=>{
    const client = useQueryClient()
    const mutation = useMutation({
        mutationKey:["UpdateOrganization"],
        mutationFn:updateOrganizationAPI,
        onSuccess:()=> client.invalidateQueries()
    })
    return mutation
}