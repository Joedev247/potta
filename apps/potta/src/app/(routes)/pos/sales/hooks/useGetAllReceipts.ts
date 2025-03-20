import { useQuery } from "@tanstack/react-query";
import { salesApi } from "../utils/api";
import { Filter } from "../utils/types";

export const useGetAllSalesReceipts = (filter: Filter) => {
  return useQuery({
    queryKey: ['get-all-sales-receipts', filter],
    queryFn: () => salesApi.getAll(filter),
  });
};
