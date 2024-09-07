import { useMutation } from "@tanstack/react-query"
import { getSingleMemberAPI } from "../../utils/team/api"

export const useSingleMember = (id:string) =>{
    const mutation = useMutation({
        mutationKey:["Members", id],
        mutationFn:()=>getSingleMemberAPI(id),
    })
    return mutation
}