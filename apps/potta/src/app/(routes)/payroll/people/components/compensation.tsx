'use client';
import React, { useState, useEffect } from 'react';
import CurrencyInput from '@potta/components/currencyInput';
import Select from '@potta/components/select';
import { CompensationPayload, PaidTimeOffItem } from '../utils/types';
import { useFetchPTOs } from '../hooks/useFetchPTOs';

interface CompensationProps {
  onChange?: (data: CompensationPayload) => void;
  initialData?: CompensationPayload | null;
}

// Payment frequency options
const paymentFrequencyOptions = [
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Bi-Weekly', value: 'Bi-Weekly' },
  { label: 'Semi-Monthly', value: 'Semi-Monthly' },
  { label: 'Monthly', value: 'Monthly' },
];

// Switch component
const Switch = ({ checked, onChange, className, children }: any) => {
  return (
    <button
      type="button"
      className={className}
      onClick={() => onChange(!checked)}
    >
      {children}
    </button>
  );
};

const Compensation: React.FC<CompensationProps> = ({
  onChange,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    hourlyRate: initialData?.hourlyRate || 0,
    salary: initialData?.salary || 0,
    paymentFrequency: initialData?.paymentFrequency || 'Monthly',
    eligibleForTips: initialData?.eligibleForTips || false,
    eligibleForOvertime: initialData?.eligibleForOvertime || false,
    paid_time_off: initialData?.paid_time_off || [],
  });

  // Fetch PTO options
  const { data: ptoOptions = [], isLoading: ptoLoading } = useFetchPTOs();

  // Selected PTO items
  const [selectedPTOs, setSelectedPTOs] = useState<PaidTimeOffItem[]>([]);

  // PTO selection state
  const [ptoSelectValue, setPtoSelectValue] = useState<string>('');

  // Time tracking code
  const [trackingCode, setTrackingCode] = useState<string[]>([
    '7',
    '7',
    '7',
    '7',
    '7',
  ]);

  // Update parent component when form data changes
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  // Initialize selected PTOs from initialData
  useEffect(() => {
    if (
      initialData?.paid_time_off &&
      initialData.paid_time_off.length > 0 &&
      ptoOptions.length > 0
    ) {
      const selectedItems = ptoOptions.filter((pto) =>
        initialData.paid_time_off.includes(pto.id)
      );
      setSelectedPTOs(selectedItems);
    }
  }, [initialData, ptoOptions]);

  // Handle input changes for compensation schedule
  const handleScheduleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentFrequency: value,
    }));
  };

  // Handle currency input changes
  const handleHourlyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Convert currency string to number
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    setFormData((prev) => ({
      ...prev,
      hourlyRate: isNaN(numericValue) ? 0 : numericValue,
    }));
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Convert currency string to number
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    setFormData((prev) => ({
      ...prev,
      salary: isNaN(numericValue) ? 0 : numericValue,
    }));
  };

  // Handle switch changes
  const handleSwitchChange = (
    field: 'eligibleForTips' | 'eligibleForOvertime',
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  // Handle PTO selection
  const handlePTOChange = (value: string) => {
    setPtoSelectValue(value);

    // Find the selected PTO
    const selectedPTO = ptoOptions.find((pto) => pto.type === value);

    if (
      selectedPTO &&
      !selectedPTOs.some((item) => item.id === selectedPTO.id)
    ) {
      const newSelectedPTOs = [...selectedPTOs, selectedPTO];
      setSelectedPTOs(newSelectedPTOs);

      // Update form data with PTO IDs
      setFormData((prev) => ({
        ...prev,
        paid_time_off: newSelectedPTOs.map((pto) => pto.id),
      }));

      // Reset select value
      setPtoSelectValue('');
    }
  };

  // Remove a PTO from selection
  const removePTO = (ptoId: string) => {
    const newSelectedPTOs = selectedPTOs.filter((pto) => pto.id !== ptoId);
    setSelectedPTOs(newSelectedPTOs);

    // Update form data with PTO IDs
    setFormData((prev) => ({
      ...prev,
      paid_time_off: newSelectedPTOs.map((pto) => pto.id),
    }));
  };

  // Generate random tracking code
  const generateTrackingCode = () => {
    const newCode = Array(5)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10).toString());
    setTrackingCode(newCode);
  };

  // Convert PTO options for select component
  const ptoSelectOptions = ptoOptions.map((pto) => ({
    label: pto.type,
    value: pto.type,
  }));

  return (
    <div className="w-full pt-10 px-14">
      <div className="w-full">
        <Select
          options={paymentFrequencyOptions}
          selectedValue={formData.paymentFrequency}
          onChange={handleScheduleChange}
          label="Compensation Schedule"
          bg={''}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <CurrencyInput
          label="Hourly Rate"
          placeholder="950"
          value={formData.hourlyRate.toString()}
          onChange={handleHourlyRateChange}
          inputClass="!bg-gray-50"
        />
        <CurrencyInput
          label="Base Pay"
          placeholder="90,000"
          value={formData.salary.toString()}
          onChange={handleSalaryChange}
          inputClass="!bg-gray-50"
        />
      </div>

      <div className="my-7 flex space-x-10">
        <div className="flex items-center">
          <Switch
            checked={formData.eligibleForTips}
            onChange={(checked) =>
              handleSwitchChange('eligibleForTips', checked)
            }
            className={`${
              formData.eligibleForTips ? 'bg-green-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
          >
            <span
              className={`${
                formData.eligibleForTips ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <span className="ml-3 text-sm font-medium">Eligible for Tips</span>
        </div>

        <div className="flex items-center">
          <Switch
            checked={formData.eligibleForOvertime}
            onChange={(checked) =>
              handleSwitchChange('eligibleForOvertime', checked)
            }
            className={`${
              formData.eligibleForOvertime ? 'bg-green-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
          >
            <span
              className={`${
                formData.eligibleForOvertime ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <span className="ml-3 text-sm font-medium">
            Eligible for Overtime
          </span>
        </div>
      </div>

      <div className="my-5">
        <p className="text-xl font-bold">Paid Time off (PTO)</p>
        <div className="mt-5">
          <Select
            options={ptoSelectOptions}
            selectedValue={ptoSelectValue}
            onChange={handlePTOChange}
            label="PTO Type"
            bg={''}
          />

          {/* Selected PTOs display */}
          {selectedPTOs.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedPTOs.map((pto) => (
                <div
                  key={pto.id}
                  className="bg-gray-100 rounded-full px-3 py-1 flex items-center text-sm"
                >
                  <span>
                    {pto.type} ({pto.total_entitled_days} days)
                  </span>
                  <button
                    onClick={() => removePTO(pto.id)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-500 mt-2">
            Select multiple PTO types to associate with this employee.
          </p>
        </div>
      </div>

      <div className="mt-7">
        <h4 className="text-xl mb-3 font-bold">Time Tracking</h4>
        <p>
          Setup a tracking code for this team member, so they can clock in and
          out from the potta mobile app. Their time cards submissions are
          visible from the admin panel
        </p>
        <div className="flex mt-3 gap-8 items-center">
          {trackingCode.map((digit, index) => (
            <p
              key={index}
              className="w-10 h-12 bg-gray-100 rounded-sm grid place-content-center"
            >
              {digit}
            </p>
          ))}
          <p
            className="text-green-500 cursor-pointer"
            onClick={generateTrackingCode}
          >
            Generate Code
          </p>
        </div>
      </div>
    </div>
  );
};

export default Compensation;
