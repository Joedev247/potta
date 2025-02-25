import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../_utils/api';

const useDeleteProduct= (user_id: string, vendor_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-product'],
    mutationFn:() => productApi.delete( user_id, vendor_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-products'] });
    },
  });
};

export default useDeleteProduct;
