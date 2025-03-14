import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { customerApi } from '../_utils/api';
import { ICustomerFilters } from '../_utils/types';

const useGetAllCustomers = (filter: ICustomerFilters) => {
  return useQuery({
    queryKey: ['get-all-customers', filter],
    queryFn: () => customerApi.getAll(filter),
  });
};

export default useGetAllCustomers;
