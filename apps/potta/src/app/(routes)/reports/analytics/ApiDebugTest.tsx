'use client';
import React, { useState } from 'react';
import { pottaAnalyticsService } from '../../../../services/analyticsService';

const ApiDebugTest: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, result: any) => {
    setResults((prev) => [
      ...prev,
      { test, result, timestamp: new Date().toISOString() },
    ]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testAvailableFacts = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing /facts endpoint...');
      const facts = await pottaAnalyticsService.getAvailableFacts();
      addResult('Available Facts', { success: true, data: facts });
      console.log('✅ Facts test successful:', facts);
    } catch (error) {
      addResult('Available Facts', { success: false, error: error });
      console.error('❌ Facts test failed:', error);
    }
    setLoading(false);
  };

  const testAvailableDimensions = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing /dimensions endpoint...');
      const dimensions = await pottaAnalyticsService.getAvailableDimensions();
      addResult('Available Dimensions', { success: true, data: dimensions });
      console.log('✅ Dimensions test successful:', dimensions);
    } catch (error) {
      addResult('Available Dimensions', { success: false, error: error });
      console.error('❌ Dimensions test failed:', error);
    }
    setLoading(false);
  };

  const testRevenueData = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing /revenue endpoint...');
      const revenue = await pottaAnalyticsService.getRevenueData('monthly');
      addResult('Revenue Data', { success: true, data: revenue });
      console.log('✅ Revenue test successful:', revenue);
    } catch (error) {
      addResult('Revenue Data', { success: false, error: error });
      console.error('❌ Revenue test failed:', error);
    }
    setLoading(false);
  };

  const testExpenseData = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing /opex endpoint...');
      const expenses = await pottaAnalyticsService.getExpenseData('monthly');
      addResult('Expense Data (OPEX)', { success: true, data: expenses });
      console.log('✅ Expenses test successful:', expenses);
    } catch (error) {
      addResult('Expense Data (OPEX)', { success: false, error: error });
      console.error('❌ Expenses test failed:', error);
    }
    setLoading(false);
  };

  const testCustomerData = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing /revenue with customer dimension...');
      const customers = await pottaAnalyticsService.getCustomerData('monthly');
      addResult('Customer Data (Revenue)', { success: true, data: customers });
      console.log('✅ Customers test successful:', customers);
    } catch (error) {
      addResult('Customer Data (Revenue)', { success: false, error: error });
      console.error('❌ Customers test failed:', error);
    }
    setLoading(false);
  };

  const testProductData = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing /revenue with product dimension...');
      const products = await pottaAnalyticsService.getProductData('monthly');
      addResult('Product Data (Revenue)', { success: true, data: products });
      console.log('✅ Products test successful:', products);
    } catch (error) {
      addResult('Product Data (Revenue)', { success: false, error: error });
      console.error('❌ Products test failed:', error);
    }
    setLoading(false);
  };

  const testPaymentData = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing /cash_equivalent endpoint...');
      const payments = await pottaAnalyticsService.getPaymentData('monthly');
      addResult('Payment Data (Cash)', { success: true, data: payments });
      console.log('✅ Payments test successful:', payments);
    } catch (error) {
      addResult('Payment Data (Cash)', { success: false, error: error });
      console.error('❌ Payments test failed:', error);
    }
    setLoading(false);
  };

  const testCogsData = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing /cogs endpoint...');
      const cogs = await pottaAnalyticsService.getCogsData('monthly');
      addResult('COGS Data', { success: true, data: cogs });
      console.log('✅ COGS test successful:', cogs);
    } catch (error) {
      addResult('COGS Data', { success: false, error: error });
      console.error('❌ COGS test failed:', error);
    }
    setLoading(false);
  };

  const testNetIncomeData = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing /net_income endpoint...');
      const netIncome = await pottaAnalyticsService.getNetIncomeData('monthly');
      addResult('Net Income Data', { success: true, data: netIncome });
      console.log('✅ Net Income test successful:', netIncome);
    } catch (error) {
      addResult('Net Income Data', { success: false, error: error });
      console.error('❌ Net Income test failed:', error);
    }
    setLoading(false);
  };

  const testAll = async () => {
    setLoading(true);
    clearResults();

    // Test in sequence to avoid overwhelming the API
    await testAvailableFacts();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testAvailableDimensions();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testRevenueData();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testExpenseData();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testCustomerData();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testProductData();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testPaymentData();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testCogsData();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testNetIncomeData();

    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Potta FP&A API Debug Test
        </h2>
        <p className="text-gray-600">
          Test individual endpoints to identify the cause of 400 errors
        </p>
      </div>

      {/* Test Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Test Controls
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={testAvailableFacts}
            disabled={loading}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
          >
            Test /facts
          </button>
          <button
            onClick={testAvailableDimensions}
            disabled={loading}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
          >
            Test /dimensions
          </button>
          <button
            onClick={testRevenueData}
            disabled={loading}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm"
          >
            Test /revenue
          </button>
          <button
            onClick={testExpenseData}
            disabled={loading}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm"
          >
            Test /expenses
          </button>
          <button
            onClick={testCustomerData}
            disabled={loading}
            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 text-sm"
          >
            Test /customers
          </button>
          <button
            onClick={testProductData}
            disabled={loading}
            className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 text-sm"
          >
            Test /products
          </button>
          <button
            onClick={testPaymentData}
            disabled={loading}
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-sm"
          >
            Test /cash_equivalent
          </button>
          <button
            onClick={testCogsData}
            disabled={loading}
            className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 text-sm"
          >
            Test /cogs
          </button>
          <button
            onClick={testNetIncomeData}
            disabled={loading}
            className="px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50 text-sm"
          >
            Test /net_income
          </button>
          <button
            onClick={testAll}
            disabled={loading}
            className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50 text-sm"
          >
            Test All
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={clearResults}
            className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Clear Results
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
        {results.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No test results yet. Click a test button above to start debugging.
          </div>
        ) : (
          results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                result.result.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{result.test}</h4>
                <span className="text-sm text-gray-500">
                  {result.timestamp}
                </span>
              </div>
              <div className="text-sm">
                {result.result.success ? (
                  <div className="text-green-700">
                    <div className="font-medium">✅ Success</div>
                    <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(result.result.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="text-red-700">
                    <div className="font-medium">❌ Failed</div>
                    <div className="mt-2 text-xs">
                      <strong>Error:</strong>{' '}
                      {result.result.error?.message || 'Unknown error'}
                    </div>
                    {result.result.error?.response?.status && (
                      <div className="text-xs">
                        <strong>Status:</strong>{' '}
                        {result.result.error.response.status}
                      </div>
                    )}
                    {result.result.error?.response?.data && (
                      <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(
                          result.result.error.response.data,
                          null,
                          2
                        )}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <div className="mt-2 text-center">Testing API endpoints...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDebugTest;
