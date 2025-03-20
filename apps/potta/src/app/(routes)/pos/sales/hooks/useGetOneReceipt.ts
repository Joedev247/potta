import { useQuery } from "@tanstack/react-query";
import { salesApi } from "../utils/api";

export const useGetOneReceipt = (receiptId: string) => {
  return useQuery({
    queryKey: ['get-sales-receipt', receiptId],
    queryFn: () => salesApi.getOne(receiptId),
    enabled: !!receiptId,
  });
};
