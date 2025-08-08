import analyticsAxios from '../config/analytics.config';

// Types for the Potta FP&A Analytics API responses
export interface FactTable {
  name: string;
  display_name: string;
  metrics: string[];
  dimensions: string[];
}

export interface AnalyticsQuery {
  fact: string;
  metrics: string[];
  dimensions: string[];
  time_granularity?: string;
  filters?: Record<string, any>;
  date_range?: Record<string, any>;
}

export interface AnalyticsResponse {
  query: AnalyticsQuery;
  sql: string;
  data: Record<string, any>[];
  metadata: {
    row_count: number;
    columns: string[];
  };
}

export interface TrendsResponse {
  metric: string;
  time_granularity: string;
  trend: string;
  growth_rate: number;
  data_points: Array<{
    period: string;
    value: number;
  }>;
}

export interface ComparisonResponse {
  metric: string;
  compare_by: string;
  comparison: Array<{
    category: string;
    value: number;
    percentage: number;
  }>;
}

export interface AnalyticsOptions {
  metrics?: string[];
  dimensions?: string[];
  time_granularity?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date?: string;
  end_date?: string;
  organization_id?: string;
  account_uuid?: string;
  product_uuid?: string;
  customer_uuid?: string;
  vendor_uuid?: string;
  use_mock_data?: boolean;
}

export interface TrendsOptions {
  metric?: string;
  time_granularity?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  periods?: number;
}

export interface ComparisonOptions {
  metric?: string;
  compare_by?: string;
}

class PottaAnalyticsService {
  /**
   * Get all available fact tables and their metrics
   * GET /api/finance/v1/facts
   */
  async getAvailableFacts(): Promise<Record<string, FactTable[]>> {
    try {
      const response = await analyticsAxios.get('/facts');
      return response.data;
    } catch (error) {
      console.error('Error fetching available facts:', error);
      throw error;
    }
  }

  /**
   * Get all available dimensions
   * GET /api/finance/v1/dimensions
   */
  async getAvailableDimensions(fact?: string): Promise<string[]> {
    try {
      const params = fact ? { fact } : {};
      const response = await analyticsAxios.get('/dimensions', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dimensions:', error);
      throw error;
    }
  }

  /**
   * Get analytics data for a specific fact
   * GET /api/finance/v1/{fact_name}
   */
  async getAnalytics(
    factName: string,
    options: AnalyticsOptions = {}
  ): Promise<AnalyticsResponse> {
    try {
      const params = new URLSearchParams();

      if (options.metrics) {
        params.append('metrics', options.metrics.join(','));
      }
      if (options.dimensions) {
        params.append('dimensions', options.dimensions.join(','));
      }
      if (options.time_granularity) {
        params.append('time_granularity', options.time_granularity);
      }
      if (options.start_date) {
        params.append('start_date', options.start_date);
      }
      if (options.end_date) {
        params.append('end_date', options.end_date);
      }
      if (options.organization_id) {
        params.append('organization_id', options.organization_id);
      }
      if (options.account_uuid) {
        params.append('account_uuid', options.account_uuid);
      }
      if (options.product_uuid) {
        params.append('product_uuid', options.product_uuid);
      }
      if (options.customer_uuid) {
        params.append('customer_uuid', options.customer_uuid);
      }
      if (options.vendor_uuid) {
        params.append('vendor_uuid', options.vendor_uuid);
      }
      // Temporarily remove use_mock_data to debug 400 errors
      // if (options.use_mock_data !== undefined) {
      //   params.append('use_mock_data', options.use_mock_data.toString());
      // }

      // Log the full URL being requested for debugging
      const fullUrl = `/${factName}?${params.toString()}`;
      console.log(`🔍 Making Potta FP&A request to: ${fullUrl}`);
      console.log(`📋 Parameters for ${factName}:`, {
        metrics: options.metrics,
        dimensions: options.dimensions,
        time_granularity: options.time_granularity,
        use_mock_data: options.use_mock_data,
      });

      const response = await analyticsAxios.get(fullUrl);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching analytics for ${factName}:`, error);
      console.error(`📋 Failed request parameters:`, {
        factName,
        metrics: options.metrics,
        dimensions: options.dimensions,
        time_granularity: options.time_granularity,
        use_mock_data: options.use_mock_data,
      });

      // Enhanced error logging
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error(`🔍 Response status: ${axiosError.response?.status}`);
        console.error(`🔍 Response data:`, axiosError.response?.data);
        console.error(`🔍 Response headers:`, axiosError.response?.headers);
      }

      throw error;
    }
  }

  /**
   * Get trend analysis for a specific fact
   * GET /api/finance/v1/{fact_name}/trends
   */
  async getTrends(
    factName: string,
    options: TrendsOptions = {}
  ): Promise<TrendsResponse> {
    try {
      const params = new URLSearchParams();

      if (options.metric) {
        params.append('metric', options.metric);
      }
      if (options.time_granularity) {
        params.append('time_granularity', options.time_granularity);
      }
      if (options.periods) {
        params.append('periods', options.periods.toString());
      }

      const response = await analyticsAxios.get(
        `/${factName}/trends?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching trends for ${factName}:`, error);
      throw error;
    }
  }

  /**
   * Compare metrics across different dimensions
   * GET /api/finance/v1/{fact_name}/comparison
   */
  async getComparison(
    factName: string,
    options: ComparisonOptions = {}
  ): Promise<ComparisonResponse> {
    try {
      const params = new URLSearchParams();

      if (options.metric) {
        params.append('metric', options.metric);
      }
      if (options.compare_by) {
        params.append('compare_by', options.compare_by);
      }

      const response = await analyticsAxios.get(
        `/${factName}/comparison?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching comparison for ${factName}:`, error);
      throw error;
    }
  }

  // Helper methods for common use cases
  async getRevenueData(
    timeGranularity:
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'quarterly'
      | 'yearly' = 'monthly'
  ) {
    return this.getAnalytics('revenue', {
      metrics: ['total_revenue'],
      dimensions: ['time'],
      time_granularity: timeGranularity,
      use_mock_data: true,
    });
  }

  async getExpenseData(
    timeGranularity:
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'quarterly'
      | 'yearly' = 'monthly'
  ) {
    // Use 'opex' (operating expenses) instead of 'expenses'
    return this.getAnalytics('opex', {
      metrics: ['opex_amount'],
      dimensions: ['time'],
      time_granularity: timeGranularity,
      use_mock_data: true,
    });
  }

  async getCustomerData(
    timeGranularity:
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'quarterly'
      | 'yearly' = 'monthly'
  ) {
    // Use 'revenue' with customer dimension instead of 'customers'
    return this.getAnalytics('revenue', {
      metrics: ['total_revenue'],
      dimensions: ['time', 'customer'],
      time_granularity: timeGranularity,
      use_mock_data: true,
    });
  }

  async getOrderData(
    timeGranularity:
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'quarterly'
      | 'yearly' = 'monthly'
  ) {
    // Use 'revenue' with product dimension to get order-like data
    return this.getAnalytics('revenue', {
      metrics: ['total_revenue'],
      dimensions: ['time', 'product'],
      time_granularity: timeGranularity,
      use_mock_data: true,
    });
  }

  async getProductData(
    timeGranularity:
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'quarterly'
      | 'yearly' = 'monthly'
  ) {
    // Use 'revenue' with product dimension to get product data
    return this.getAnalytics('revenue', {
      metrics: ['total_revenue'],
      dimensions: ['time', 'product'],
      time_granularity: timeGranularity,
      use_mock_data: true,
    });
  }

  async getPaymentData(
    timeGranularity:
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'quarterly'
      | 'yearly' = 'monthly'
  ) {
    // Use 'cash_equivalent' for payment-like data
    return this.getAnalytics('cash_equivalent', {
      metrics: ['net_cash_movement'],
      dimensions: ['time'],
      time_granularity: timeGranularity,
      use_mock_data: true,
    });
  }

  // Additional helper methods for other available fact tables
  async getCogsData(
    timeGranularity:
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'quarterly'
      | 'yearly' = 'monthly'
  ) {
    return this.getAnalytics('cogs', {
      metrics: ['total_cost'],
      dimensions: ['time'],
      time_granularity: timeGranularity,
      use_mock_data: true,
    });
  }

  async getCapexData(
    timeGranularity:
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'quarterly'
      | 'yearly' = 'monthly'
  ) {
    return this.getAnalytics('capex', {
      metrics: ['capex_amount'],
      dimensions: ['time'],
      time_granularity: timeGranularity,
      use_mock_data: true,
    });
  }

  async getNetIncomeData(
    timeGranularity:
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'quarterly'
      | 'yearly' = 'monthly'
  ) {
    return this.getAnalytics('net_income', {
      metrics: ['net_income_after_tax'],
      dimensions: ['time'],
      time_granularity: timeGranularity,
      use_mock_data: true,
    });
  }

  async getArBalanceData(
    timeGranularity:
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'quarterly'
      | 'yearly' = 'monthly'
  ) {
    return this.getAnalytics('ar_balance', {
      metrics: ['customer_running_balance'],
      dimensions: ['time'],
      time_granularity: timeGranularity,
      use_mock_data: true,
    });
  }

  async getApBalanceData(
    timeGranularity:
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'quarterly'
      | 'yearly' = 'monthly'
  ) {
    return this.getAnalytics('ap_balance', {
      metrics: ['vendor_running_balance'],
      dimensions: ['time'],
      time_granularity: timeGranularity,
      use_mock_data: true,
    });
  }
}

export const pottaAnalyticsService = new PottaAnalyticsService();
export default pottaAnalyticsService;
