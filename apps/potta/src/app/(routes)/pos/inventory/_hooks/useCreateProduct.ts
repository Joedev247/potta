import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../_utils/api';
import { IProductPayload } from '../_utils/validation';

const useCreateProduct = (user_id: string, vendor_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-product'],
    mutationFn: (data: IProductPayload) => productApi.create(data, user_id, vendor_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-product'] });
    },
  });
};

export default useCreateProduct;
