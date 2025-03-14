
export type VendorFilter = {
  limit?: number;
  page?: number;
  sortBy?: 'updatedAt:ASC' | 'createdAt:ASC' | 'updatedAt:DESC' | 'createdAt:DES';
  search?: string;
};

export type Vendor ={

    uuid: string,
    createdAt: string | null,
    createdBy: string | null,
    updatedBy: string | null,
    deletedAt: string | null,
    updatedAt: string | null,
    orgId: string | null,
    vendorId: string | null,
    type: string ,
    name: string | null,
    paymentTerms: string | null,
    paymentMethod: string | null,
    accountDetails: string | null,
    openingBalance: string | null,
    currency: string ,
    phone: string | null,
    email: string | null,
    contactPerson: string | null,
    website: string | null,
    taxId: string | null,
    classification: string ,
    notes: string | null,
    status: string | null,
    address: {
      uuid: string | null,
      createdAt: string | null,
      createdBy: null,
      updatedBy: null,
      deletedAt: null,
      updatedAt: string | null,
      address: string | null,
      city: string | null,
      state: string | null,
      country: string | null,
      postalCode: string | null,
      latitude: number,
      longitude: number,
      geospatialLocation:string | null
    }

}

export interface VendorResponse {
  data: Vendor[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
}