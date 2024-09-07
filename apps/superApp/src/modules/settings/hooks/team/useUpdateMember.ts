import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateMemberAPI } from "../../utils/team/api"
import { MemberFormData } from "../../utils/team/validations"

export const useUpdateMember =(id:string)=>{
    const client = useQueryClient()
    const mutation = useMutation({
        mutationKey:["UpdateMember"],
        mutationFn:(data:MemberFormData)=>updateMemberAPI(id,data),
        onSuccess: () => client.invalidateQueries({queryKey:["Members"]})
    })
    return mutation
}