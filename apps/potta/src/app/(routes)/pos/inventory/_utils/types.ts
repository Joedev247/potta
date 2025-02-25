export type IFilter = {
  limit: number;
  page: number;
  sortBy: 'updatedAt' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
};
