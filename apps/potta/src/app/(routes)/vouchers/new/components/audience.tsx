'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Check, ChevronDown } from 'lucide-react';

interface AudienceProps {
  // Add any props if needed
}

const Audience: React.FC<AudienceProps> = () => {
  const { register, watch, setValue } = useFormContext();
  const autoAddUsers = watch('autoAddUsers') || false;
  const canJoinOnce = watch('canJoinOnce') || false;

  return (
    <div className="bg-white p-6">
      <h3 className="text-xl font-medium mb-8">Audience Settings</h3>

      <div className="space-y-6 w-3/5">
        {/* Audience Segment Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Audience segment
          </label>
          <div className="relative flex-1 w-1/2">
          <select
            {...register('audience.segment')}
            className="w-full appearance-none border bg-white border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select Audience segment</option>
            <option value="all">All Customers</option>
            <option value="new">New Customers</option>
            <option value="returning">Returning Customers</option>
            <option value="vip">VIP Customers</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        </div>

        {/* Checkboxes */}
        <div className="flex space-x-4">
          <div className="flex items-center">
            <div
              className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer ${
                autoAddUsers
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300'
              }`}
              onClick={() => setValue('autoAddUsers', !autoAddUsers)}
            >
              {autoAddUsers && <Check className="h-4 w-4 text-white" />}
            </div>
            <input
              type="checkbox"
              {...register('autoAddUsers')}
              className="hidden"
            />
            <label
              className="ml-2 text-sm text-gray-700 cursor-pointer"
              onClick={() => setValue('autoAddUsers', !autoAddUsers)}
            >
              Automatically Add new users to this program
            </label>
          </div>

          <div className="flex items-center">
            <div
              className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer ${
                canJoinOnce
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300'
              }`}
              onClick={() => setValue('canJoinOnce', !canJoinOnce)}
            >
              {canJoinOnce && <Check className="h-4 w-4 text-white" />}
            </div>
            <input
              type="checkbox"
              {...register('canJoinOnce')}
              className="hidden"
            />
            <label
              className="ml-2 text-sm text-gray-700 cursor-pointer"
              onClick={() => setValue('canJoinOnce', !canJoinOnce)}
            >
              Can only join campaigns once
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audience;
