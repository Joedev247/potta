import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createMemberAPI } from "../../utils/team/api"

export const useCreateMember =()=>{
    const client = useQueryClient()
    const mutation = useMutation({
        mutationKey:["CreateMember"],
        mutationFn:createMemberAPI,
        onSuccess: () => client.invalidateQueries({queryKey:["Members"]})
    })
    return mutation
}