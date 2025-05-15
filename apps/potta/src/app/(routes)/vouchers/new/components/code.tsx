'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Check } from 'lucide-react';

interface CodeProps {
  // Add any props if needed
}

const Code: React.FC<CodeProps> = () => {
  const { register, watch, setValue } = useFormContext();
 
  const advancedCodeSettings = watch('advancedCodeSettings') || false;

  return (
    <div className="bg-white p-6">
      <h3 className="text-xl font-medium mb-8">Code Settings</h3>
      {/* Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Code
        </label>
        <input
          type="text"
          {...register('code')}
          className="w-1/2 border border-gray-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="SAVE20"
          disabled={advancedCodeSettings}
        />
      </div>
      <div className="space-y-6 w-3/5">
        {/* Program Card Prefix */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Program Card Prefix
          </label>
          <input
            type="text"
            {...register('programCardPrefix')}
            className="w-1/2 border border-gray-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Program-02152"
          />
        </div>

        {/* Maximum Entries */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Entries
          </label>
          <input
            type="number"
            {...register('UsageLimit')}
            className="w-1/2 border border-gray-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="55"
          />
        </div>

        {/* Advanced Code Settings */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Advanced code settings
            </label>
            <div
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                advancedCodeSettings ? 'bg-green-500' : 'bg-gray-200'
              }`}
              onClick={() => {
                setValue('advancedCodeSettings', !advancedCodeSettings);
                setValue('code', '');
              }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  advancedCodeSettings ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
            <input
              type="checkbox"
              {...register('advancedCodeSettings')}
              className="hidden"
            />
          </div>
        </div>

        {/* Advanced Code Settings Fields */}
        {advancedCodeSettings && (
          <div className="border-dotted border border-gray-200  p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code Prefix
                </label>
                <input
                  type="text"
                  {...register('codeSettings.prefix')}
                  className="w-full border border-gray-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="ABC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code Postfix
                </label>
                <input
                  type="text"
                  {...register('codeSettings.postfix')}
                  className="w-full border border-gray-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="XYZ"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code length
                </label>
                <input
                  type="number"
                  {...register('codeSettings.length')}
                  className="w-full border border-gray-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="11"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  pattern (# is replaced with a random number)
                </label>
                <input
                  type="text"
                  {...register('codeSettings.pattern')}
                  className="w-full border border-gray-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="#125###120"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code Type
                </label>
                <select
                  {...register('codeType')}
                  className="w-full border border-gray-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="alphanumeric">AlphaNumeric</option>
                  <option value="numeric">Numeric</option>
                  <option value="alpha">Alphabetic</option>
                </select>
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Character Set
                </label>
                <input
                  type="text"
                  {...register('codeSettings.characterSet')}
                  className="w-full border border-gray-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="01223456789abcdefghijklmnopirstuvwxyz"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Code;
