'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export default function Eligibility() {
  const { register } = useFormContext();
  const [showNewSegmentForm, setShowNewSegmentForm] = useState(false);

  return (
    <div className="bg-white w-3/5 p-6">
      <h2 className="text-xl font-semibold mb-4">Eligibility</h2>
      <p className="text-gray-600 mb-6">
        Define which customer segments are eligible for this voucher
      </p>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Select segments
          </label>
          <button
            type="button"
            onClick={() => setShowNewSegmentForm(true)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            + New segment
          </button>
        </div>
        
        <div className="relative">
          <select
            {...register('segments')}
            className="block w-full  border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 appearance-none"
          >
            <option value="">select segments</option>
            <option value="all_customers">All customers</option>
            <option value="new_customers">New customers</option>
            <option value="returning_customers">Returning customers</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* {showNewSegmentForm && (
        <div className="bg-gray-50 p-4  mb-6">
          <h3 className="text-md font-medium mb-3">Create new segment</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Segment name
            </label>
            <input
              type="text"
              className="block w-full  border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter segment name"
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowNewSegmentForm(false)}
              className="px-4 py-2 border border-gray-300  text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white "
            >
              Create segment
            </button>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-100  p-4">
        <p className="text-sm text-yellow-800">
          No segments selected. Voucher will be available to all customers by default.
        </p>
      </div> */}
    </div>
  );
}