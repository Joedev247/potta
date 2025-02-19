import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../_utils/api';

const useUpdateProduct = (vendor_id: string, product_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-product'],
    mutationFn: (data) => productApi.update(vendor_id, product_id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['get-all-product'] }),
  });
};

export default useUpdateProduct;
