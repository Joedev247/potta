import React from 'react';
import Slider from '@potta/components/slideover';
import moment from 'moment';
import {
  formatCurrencyWithoutDecimals,
  formatPercentageWithoutDecimals,
  formatNumberWithoutDecimals,
} from '../utils/formUtils';

interface Benefit {
  uuid: string;
  name: string;
  description: string;
  type: 'FINANCIAL' | 'SERVICE' | 'REDEEMABLE';
  value: string;
  cycle:
    | 'DAILY'
    | 'WEEKLY'
    | 'MONTHLY'
    | 'QUARTERLY'
    | 'ANNUALLY'
    | 'ONE_TIME'
    | 'NONE';
  is_taxable: boolean;
  tax_cap: string;
  rate: string;
  salary_cap: string;
  max_amount: string;
  provider: string;
  expires_at: string | null;
  role_based: boolean;
  is_default: boolean;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  eligible_roles: any[];
  createdAt: string;
  updatedAt: string;
}

interface ViewBenefitProps {
  isOpen: boolean;
  onClose: () => void;
  benefit: Benefit | null;
}

const ViewBenefit: React.FC<ViewBenefitProps> = ({
  isOpen,
  onClose,
  benefit,
}) => {
  if (!benefit) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      PENDING: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pending',
      },
      EXPIRED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Expired' },
      SUSPENDED: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: 'Suspended',
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FINANCIAL':
        return <i className="ri-money-dollar-circle-line text-green-600"></i>;
      case 'SERVICE':
        return <i className="ri-service-line text-blue-600"></i>;
      case 'REDEEMABLE':
        return <i className="ri-gift-line text-purple-600"></i>;
      default:
        return <i className="ri-question-line text-gray-600"></i>;
    }
  };

  const formatCurrency = (amount: string) => {
    if (!amount || amount === '0') return 'N/A';
    return formatCurrencyWithoutDecimals(amount);
  };

  const formatCycle = (cycle: string) => {
    const cycleLabels = {
      DAILY: 'Daily',
      WEEKLY: 'Weekly',
      MONTHLY: 'Monthly',
      QUARTERLY: 'Quarterly',
      ANNUALLY: 'Annually',
      ONE_TIME: 'One Time',
      NONE: 'None',
    };
    return cycleLabels[cycle as keyof typeof cycleLabels] || cycle;
  };

  return (
    <Slider
      edit={false}
      title="Benefit Details"
      open={isOpen}
      setOpen={onClose}
      noPanelScroll={false}
    >
      <div className="p-6 space-y-6 w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
              {getTypeIcon(benefit.type)}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {benefit.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {benefit.type.charAt(0) + benefit.type.slice(1).toLowerCase()} •{' '}
                {formatCycle(benefit.cycle)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusBadge(benefit.status)}
            {benefit.is_default && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Default
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {benefit.description && (
          <div className="bg-gray-50  p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Description
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {benefit.description}
            </p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Benefit Information */}
          <div className="bg-white border border-gray-200  p-5">
            <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
              <i className="ri-information-line mr-2 text-blue-600"></i>
              Benefit Information
            </h4>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Value
                </dt>
                <dd className="text-lg font-semibold text-gray-900 mt-1">
                  {formatCurrency(benefit.value)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Rate
                </dt>
                <dd className="text-lg font-semibold text-gray-900 mt-1">
                  {benefit.rate
                    ? formatPercentageWithoutDecimals(benefit.rate)
                    : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Cycle
                </dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {formatCycle(benefit.cycle)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Provider
                </dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {benefit.provider || 'Internal'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Financial Details */}
          <div className="bg-white border border-gray-200  p-5">
            <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
              <i className="ri-money-dollar-circle-line mr-2 text-green-600"></i>
              Financial Details
            </h4>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Taxable
                </dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      benefit.is_taxable
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {benefit.is_taxable ? 'Yes' : 'No'}
                  </span>
                </dd>
              </div>
              {benefit.is_taxable && benefit.tax_cap && (
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Tax Cap
                  </dt>
                  <dd className="text-sm font-semibold text-gray-900 mt-1">
                    {formatCurrency(benefit.tax_cap)}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Salary Cap
                </dt>
                <dd className="text-sm font-semibold text-gray-900 mt-1">
                  {formatCurrency(benefit.salary_cap)}
                </dd>
              </div>
              {benefit.max_amount && (
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Max Amount
                  </dt>
                  <dd className="text-sm font-semibold text-gray-900 mt-1">
                    {formatCurrency(benefit.max_amount)}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Role & Access Information */}
          <div className="bg-white border border-gray-200  p-5">
            <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
              <i className="ri-team-line mr-2 text-purple-600"></i>
              Role & Access
            </h4>
            <div className="space-y-4">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Access Type
                </dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      benefit.role_based
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {benefit.role_based ? 'Role-based' : 'All Roles'}
                  </span>
                </dd>
              </div>
              {benefit.role_based &&
                benefit.eligible_roles &&
                benefit.eligible_roles.length > 0 && (
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Eligible Roles
                    </dt>
                    <div className="flex flex-wrap gap-1">
                      {benefit.eligible_roles.map((role, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {role.name || role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Dates Section */}
        <div className="bg-white border border-gray-200  p-5">
          <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
            <i className="ri-calendar-line mr-2 text-orange-600"></i>
            Important Dates
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Created
              </dt>
              <dd className="text-sm text-gray-900 mt-1">
                {moment(benefit.createdAt).format('MMM DD, YYYY')}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Last Updated
              </dt>
              <dd className="text-sm text-gray-900 mt-1">
                {moment(benefit.updatedAt).format('MMM DD, YYYY')}
              </dd>
            </div>
            {benefit.expires_at && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Expires
                </dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {moment(benefit.expires_at).format('MMM DD, YYYY')}
                </dd>
              </div>
            )}
          </div>
        </div>
      </div>
    </Slider>
  );
};

export default ViewBenefit;
