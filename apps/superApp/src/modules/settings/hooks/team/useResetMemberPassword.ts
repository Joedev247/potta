import { useMutation, useQueryClient } from "@tanstack/react-query"
import { resetMemberPasswordAPI } from "../../utils/team/api"

export const useResetMemberPassword =(id:string)=>{
    const client = useQueryClient()
    const mutation = useMutation({
        mutationKey:["ResetMemberPassword", id],
        mutationFn:(data:{password:string})=>resetMemberPasswordAPI(id,data),
        onSuccess: () => client.invalidateQueries({queryKey:["Members", id]})
    })
    return mutation
}