import axios from '../../../../../../config/axios.config';

export interface PurchaseOrderFilter {
  page?: number;
  limit?: number;
  sortBy?: string[];
  search?: string;
  searchBy?: string[];
}

export async function fetchPurchaseOrders(filter: PurchaseOrderFilter) {
  const response = await axios.post(
    '/purchase-order/filter',
    {},
    {
      params: {
        page: filter.page,
        limit: filter.limit,
        sortBy: filter.sortBy,
        search: filter.search,
        searchBy: filter.searchBy,
      },
    }
  );
  return response.data;
}
