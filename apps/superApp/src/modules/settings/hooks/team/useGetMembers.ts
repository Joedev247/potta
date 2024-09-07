import { useMutation } from "@tanstack/react-query"
import { getMembersAPI } from "../../utils/team/api"

export const useGetMembers = () =>{
    const mutation = useMutation({
        mutationKey:["Members"],
        mutationFn:getMembersAPI,
    })
    return mutation
}