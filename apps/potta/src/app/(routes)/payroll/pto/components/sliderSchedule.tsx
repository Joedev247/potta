'use client';
import React, { useState } from 'react';
import Button from '@potta/components/button';
import Input from '@potta/components/input';
import Select from '@potta/components/select';
import Slider from '@potta/components/slideover';
import { toast } from 'react-hot-toast';
import { useCreatePTOPolicy } from '../hooks/useCreatePTOPolicy';

const SliderSchedule = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [type, setType] = useState('VACATION');
  const [cycleType, setCycleType] = useState('MONTHLY');
  const [accrualRate, setAccrualRate] = useState('');
  const [totalEntitledDays, setTotalEntitledDays] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Use our custom hook for PTO policy creation
  const { createPTOPolicy, isSubmitting } = useCreatePTOPolicy();

  // Options for dropdown selects
  const typeOptions = [
    { label: 'Vacation', value: 'VACATION' },
    { label: 'Sick Leave', value: 'SICK_LEAVE' },
    { label: 'Personal', value: 'PERSONAL' },
    { label: 'Maternity', value: 'MATERNITY' },
    { label: 'Paternity', value: 'PATERNITY' },
  ];

  const cycleTypeOptions = [
    { label: 'Daily', value: 'DAILY' },
    { label: 'Weekly', value: 'WEEKLY' },
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Yearly', value: 'YEARLY' },
  ];

  // Handle accrual rate input change
  const handleAccrualRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAccrualRate(value);

    // Clear validation error when user starts typing
    if (validationErrors.accrualRate) {
      setValidationErrors((prev) => ({ ...prev, accrualRate: '' }));
    }
  };

  // Handle total entitled days input change
  const handleTotalEntitledDaysChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setTotalEntitledDays(value);

    // Clear validation error when user starts typing
    if (validationErrors.totalEntitledDays) {
      setValidationErrors((prev) => ({ ...prev, totalEntitledDays: '' }));
    }
  };

  // Handle date changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    if (validationErrors.startDate) {
      setValidationErrors((prev) => ({ ...prev, startDate: '' }));
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    if (validationErrors.endDate) {
      setValidationErrors((prev) => ({ ...prev, endDate: '' }));
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Validate accrual rate
    if (!accrualRate.trim()) {
      errors.accrualRate = 'Accrual rate is required';
    } else if (isNaN(parseFloat(accrualRate)) || parseFloat(accrualRate) <= 0) {
      errors.accrualRate = 'Accrual rate must be a positive number';
    }

    // Validate total entitled days
    if (!totalEntitledDays.trim()) {
      errors.totalEntitledDays = 'Total entitled days is required';
    } else if (
      isNaN(parseInt(totalEntitledDays)) ||
      parseInt(totalEntitledDays) <= 0
    ) {
      errors.totalEntitledDays =
        'Total entitled days must be a positive number';
    }

    // Validate start date
    if (!startDate) {
      errors.startDate = 'Start date is required';
    }

    // Validate end date
    if (!endDate) {
      errors.endDate = 'End date is required';
    } else if (startDate && new Date(endDate) <= new Date(startDate)) {
      errors.endDate = 'End date must be after start date';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form after submission
  const resetForm = () => {
    setType('VACATION');
    setCycleType('MONTHLY');
    setAccrualRate('');
    setTotalEntitledDays('');
    setStartDate('');
    setEndDate('');
    setValidationErrors({});
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const result = await createPTOPolicy({
          type,
          cycle_type: cycleType,
          accrual_rate: parseFloat(accrualRate),
          total_entitled_days: parseInt(totalEntitledDays),
          start_date: startDate,
          end_date: endDate,
          status: 'ACTIVE',
        });

        if (result.success) {
          // Reset form and close slider on success
          resetForm();
          setIsSliderOpen(false);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('An error occurred while creating the PTO policy');
      }
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  return (
    <Slider
      edit={false}
      title={'Add PTO Policy'}
      buttonText="New Schedules"
      isOpen={isSliderOpen}
      onOpenChange={setIsSliderOpen}
      button={
        <Button
          text={'New PTO Policy'}
          type={'button'}
          icon={<i className="ri-file-add-line"></i>}
          onClick={() => setIsSliderOpen(true)}
        />
      }
    >
      <div className="flex flex-col gap-5 w-full max-w-4xl">
        <div>
          <p className="mb-2 font-medium">PTO Type</p>
          <Select
            options={typeOptions}
            selectedValue={type}
            onChange={(value) => setType(value)}
            bg={''}
          />
        </div>

        <div>
          <p className="mb-2 font-medium">Cycle Type</p>
          <Select
            options={cycleTypeOptions}
            selectedValue={cycleType}
            onChange={(value) => setCycleType(value)}
            bg={''}
          />
        </div>

        <div>
          <p className="mb-2 font-medium">Accrual Rate</p>
          <Input
            name="accrualRate"
            type="text"
            placeholder="Enter accrual rate (e.g., 1.25)"
            value={accrualRate}
            onchange={handleAccrualRateChange}
            errors={
              validationErrors.accrualRate
                ? { message: validationErrors.accrualRate }
                : undefined
            }
          />
          <p className="mt-1 text-xs text-gray-500">
            Rate at which PTO is accrued per cycle
          </p>
        </div>

        <div>
          <p className="mb-2 font-medium">Total Entitled Days</p>
          <Input
            name="totalEntitledDays"
            type="text"
            placeholder="Enter total entitled days (e.g., 15)"
            value={totalEntitledDays}
            onchange={handleTotalEntitledDaysChange}
            errors={
              validationErrors.totalEntitledDays
                ? { message: validationErrors.totalEntitledDays }
                : undefined
            }
          />
          <p className="mt-1 text-xs text-gray-500">
            Maximum number of days an employee can accrue
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2 font-medium">Start Date</p>
            <Input
              name="startDate"
              type="date"
              value={startDate}
              onchange={handleStartDateChange}
              errors={
                validationErrors.startDate
                  ? { message: validationErrors.startDate }
                  : undefined
              }
            />
          </div>
          <div>
            <p className="mb-2 font-medium">End Date</p>
            <Input
              name="endDate"
              type="date"
              value={endDate}
              onchange={handleEndDateChange}
              errors={
                validationErrors.endDate
                  ? { message: validationErrors.endDate }
                  : undefined
              }
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            text={isSubmitting ? 'Adding...' : 'Add Policy'}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </Slider>
  );
};

export default SliderSchedule;
