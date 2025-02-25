import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../_utils/api';
import { IProductPayload } from '../_utils/validation';

const useCreateProduct = (vendor_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-product'],
    mutationFn: (data: IProductPayload) => productApi.create(data,  vendor_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-product'] });
    },
  });
};

export default useCreateProduct;
