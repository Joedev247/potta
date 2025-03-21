export type Filter = {
  limit: number;
  page: number;
  sortBy?: 'updatedAt' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
};


export type Product = {
  uuid: string,
  createdAt: string,
  createdBy: string,
  updatedBy: string | null,
  deletedAt: string | null,
  updatedAt: string | null,
  productId: string,
  name: string,
  description: string,
  unitOfMeasure: string,
  cost: number,
  sku: string,
  inventoryLevel: number,
  salesPrice: number,
  taxable: boolean,
  taxRate: number,
  category: string,
  images: null,
  status: string,

}


export type ProductResponse = {
  data: Product[],
  meta: {
    itemsPerPage: number,
    totalItems: number,
    currentPage: number,
    totalPages: number
  }
}

