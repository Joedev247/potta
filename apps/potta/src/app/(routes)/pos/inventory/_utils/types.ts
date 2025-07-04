export type Filter = {
  limit: number;
  page: number;
  sortBy?: 'updatedAt' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
};

export type Product = {
  uuid: string;
  createdAt: string;
  createdBy: string;
  updatedBy: string | null;
  deletedAt: string | null;
  updatedAt: string | null;
  productId: string;
  name: string;
  documents?: { url: string } | null;
  description: string;
  unitOfMeasure: string;
  cost: string;
  sku: string;
  inventoryLevel: number;
  salesPrice: string;
  taxable: boolean;
  taxRate?: number;
  category: { name: string } | null;
  tax?: { name: string } | null;
  images: any[] | null;
  status: string;
};

export type ProductResponse = {
  data: Product[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
};

export type ProductCategory = {
  uuid: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  orgId: string;
  branchId: string;
};

export type ProductCategoryResponse = {
  data: ProductCategory[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
};
