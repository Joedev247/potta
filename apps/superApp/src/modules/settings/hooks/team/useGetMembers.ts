import { useQuery } from "@tanstack/react-query"
import { getMembersAPI } from "../../utils/team/api"

export const useGetMembers = () =>{
    const query = useQuery({
        queryKey:["Members"],
        queryFn:getMembersAPI,
    })
    return query
}