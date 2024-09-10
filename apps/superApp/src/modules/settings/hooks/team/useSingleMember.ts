import { useQuery } from "@tanstack/react-query"
import { getSingleMemberAPI } from "../../utils/team/api"

export const useSingleMember = (id:string) =>{
    const query = useQuery({
        queryKey:["Members", id],
        queryFn:()=>getSingleMemberAPI(id),
    })
    return query
}