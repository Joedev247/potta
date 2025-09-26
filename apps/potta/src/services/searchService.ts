import axios from '../../config/axios.config';

// Types for the search API
export interface SearchRequest {
  query: string;
  orgId: string;
  entityTypes?: string[];
  locationContextId?: string;
  filters?: {
    dateRange?: {
      from: string;
      to: string;
    };
    status?: string[];
    amountRange?: {
      min: number;
      max: number;
    };
  };
  pagination?: {
    page: number;
    limit: number;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  fuzzy?: boolean;
  highlight?: boolean;
  minScore?: number;
  fields?: string[];
  facets?: boolean;
}

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  path: string;
  priority?: 'high' | 'medium' | 'low';
  score?: number;
  highlights?: string[];
  metadata?: Record<string, any>;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  aggregations?: {
    entityTypes?: Record<string, number>;
    [key: string]: any;
  };
  query: string;
  took: number;
}

export interface SuggestionsRequest {
  query: string;
  orgId: string;
  limit?: number;
}

export interface SuggestionsResponse {
  suggestions: string[];
}

export interface FacetsResponse {
  facets: Record<string, Record<string, number>>;
}

class SearchService {
  private basePath = '/api/search';

  /**
   * Perform global search across all entities
   */
  async globalSearch(request: SearchRequest): Promise<SearchResponse> {
    try {
      const response = await axios.post(`${this.basePath}/global`, request);
      return response.data;
    } catch (error) {
      console.error('Error in global search:', error);
      throw error;
    }
  }

  /**
   * Get search suggestions for auto-complete
   */
  async getSuggestions(
    request: SuggestionsRequest
  ): Promise<SuggestionsResponse> {
    try {
      const params = new URLSearchParams({
        query: request.query,
        orgId: request.orgId,
        ...(request.limit && { limit: request.limit.toString() }),
      });

      const response = await axios.get(
        `${this.basePath}/suggestions?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      throw error;
    }
  }

  /**
   * Get available search facets and their counts
   */
  async getFacets(orgId: string): Promise<FacetsResponse> {
    try {
      const response = await axios.get(`${this.basePath}/facets`, {
        params: { orgId },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting search facets:', error);
      throw error;
    }
  }

  /**
   * Transform search results to match the component's expected format
   */
  transformSearchResults(results: SearchResult[]): Array<{
    id: string;
    type: string;
    title: string;
    subtitle: string;
    path: string;
    priority?: 'high' | 'medium' | 'low';
  }> {
    return results.map((result) => ({
      id: result.id,
      type: result.type,
      title: result.title,
      subtitle: result.subtitle,
      path: result.path,
      priority: result.priority || 'medium',
    }));
  }

  /**
   * Map filter options to API entity types
   */
  mapEntityTypesToAPI(filterOptions: {
    entities: string[];
    itemTypes: string[];
    transactionType: string[];
  }): string[] {
    const entityTypeMap: Record<string, string> = {
      Customers: 'customer',
      'Vendors (Suppliers)': 'vendor',
      Employees: 'employee',
      Partners: 'partner',
      'Leads/Prospects': 'lead',
      'Other Contacts': 'contact',
      'Inventory Items': 'product',
      'Non-Inventory Items': 'product',
      'Service Items': 'service',
      'Assembly Items': 'product',
      'Kit/Package Items': 'product',
      'Discount Items': 'product',
      'Markup Items': 'product',
      'Gift Certificates': 'product',
      'Deferred Revenue Items': 'product',
      'Expense Items': 'expense',
      'Sales Order': 'sales_order',
      Invoice: 'invoice',
      'Cash Sale': 'cash_sale',
      'Credit Memo': 'credit_memo',
      'Customer Payment': 'payment',
      'Estimate/Quote': 'estimate',
      'Purchase Order': 'purchase_order',
      'Vendor Bill': 'vendor_bill',
      'Vendor Credit': 'vendor_credit',
      'Vendor Payment (Bill Payment)': 'vendor_payment',
      'Expense Report': 'expense_report',
      'Inventory Adjustment': 'inventory_adjustment',
      'Inventory Transfer': 'inventory_transfer',
      'Journal Entry': 'journal_entry',
      Deposit: 'deposit',
      Withdrawal: 'withdrawal',
      'Transfer Funds': 'transfer',
      'Credit Card Charge': 'credit_card_charge',
      'Bank Reconciliation': 'bank_reconciliation',
      'Payroll Run': 'payroll_run',
      Budget: 'budget',
    };

    const allSelectedTypes = [
      ...filterOptions.entities,
      ...filterOptions.itemTypes,
      ...filterOptions.transactionType,
    ];

    return allSelectedTypes
      .map((type) => entityTypeMap[type])
      .filter(Boolean) // Remove undefined mappings
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  }
}

export const searchService = new SearchService();
export default searchService;


