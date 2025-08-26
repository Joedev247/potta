'use client';
import React from 'react';
import { ContextData } from '@potta/components/context';
import RootLayout from '../../layout';
import { useContext } from 'react';

const CashFlowPage = () => {
  const context = useContext(ContextData);

  return (
    <RootLayout>
      <div className={`${context?.layoutMode === 'sidebar' ? 'pl-8' : 'pl-5'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Cash Flow Forecast
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and project your cash flow with advanced forecasting tools
            </p>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Current Cash Position */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Cash
              </h3>
              <div className="text-3xl font-bold text-blue-600">€2,450,000</div>
              <p className="text-sm text-gray-600 mt-2">
                Available cash balance
              </p>
            </div>

            {/* Projected Cash */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Projected Cash
              </h3>
              <div className="text-3xl font-bold text-green-600">
                €2,850,000
              </div>
              <p className="text-sm text-gray-600 mt-2">12-month projection</p>
            </div>

            {/* Growth */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Growth
              </h3>
              <div className="text-3xl font-bold text-green-600">+16.3%</div>
              <p className="text-sm text-gray-600 mt-2">Projected growth</p>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cash Flow Chart
            </h3>
            <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart will be implemented here</p>
            </div>
          </div>

          {/* Table Placeholder */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Month
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Cash In
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Cash Out
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Net Flow
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">January</td>
                    <td className="py-3 px-4 text-right text-green-600">
                      €1,200,000
                    </td>
                    <td className="py-3 px-4 text-right text-red-600">
                      €800,000
                    </td>
                    <td className="py-3 px-4 text-right text-green-600">
                      €400,000
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      €2,850,000
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">February</td>
                    <td className="py-3 px-4 text-right text-green-600">
                      €1,400,000
                    </td>
                    <td className="py-3 px-4 text-right text-red-600">
                      €900,000
                    </td>
                    <td className="py-3 px-4 text-right text-green-600">
                      €500,000
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      €3,350,000
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">March</td>
                    <td className="py-3 px-4 text-right text-green-600">
                      €1,600,000
                    </td>
                    <td className="py-3 px-4 text-right text-red-600">
                      €1,100,000
                    </td>
                    <td className="py-3 px-4 text-right text-green-600">
                      €500,000
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      €3,850,000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default CashFlowPage;
