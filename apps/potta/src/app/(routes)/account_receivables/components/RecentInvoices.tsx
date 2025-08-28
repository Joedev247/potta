'use client';
import React from 'react';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  date: string;
  status: string;
}

interface RecentInvoicesProps {
  invoices: Invoice[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const RecentInvoices: React.FC<RecentInvoicesProps> = ({
  invoices,
  formatCurrency,
  formatDate,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'overdue':
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'overdue':
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white p-6  border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Invoices</h2>
        <div className="p-2 bg-blue-100 ">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      <div className="space-y-3">
        {invoices.length > 0 ? (
          invoices.map((invoice, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50  hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white  shadow-sm">
                  {getStatusIcon(invoice.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {invoice.customer}
                  </p>
                  <p className="text-xs text-gray-500">Invoice #{invoice.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(invoice.amount)}
                </p>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {invoice.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(invoice.date)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No recent invoices available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentInvoices;
