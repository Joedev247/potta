'use client';
import React, { useState } from 'react';
import Button from '@potta/components/button';
import Input from '@potta/components/input';
import Select from '@potta/components/select';
import Slider from '@potta/components/slideover';
import { toast } from 'react-hot-toast';
import { Upload } from 'lucide-react';
import CurrencyInput from '@potta/components/currencyInput';

const SliderSchedule = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [policyName, setPolicyName] = useState('');
  const [cycle, setCycle] = useState('Monthly');
  const [duration, setDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState('Hours');
  const [rateType, setRateType] = useState('Flat Rate');
  const [rate, setRate] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options for dropdown selects
  const cycleOptions = [
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Quarterly', value: 'Quarterly' },
    { label: 'Yearly', value: 'Yearly' },
  ];

  const durationUnitOptions = [
    { label: 'Hours', value: 'Hours' },
    { label: 'Days', value: 'Days' },
    { label: 'Weeks', value: 'Weeks' },
    { label: 'Months', value: 'Months' },
  ];

  const rateTypeOptions = [
    { label: 'Flat Rate', value: 'Flat Rate' },
    { label: 'Percentage', value: 'Percentage' },
  ];

  const frequencyOptions = [
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Quarterly', value: 'Quarterly' },
    { label: 'Yearly', value: 'Yearly' },
    { label: 'One Time', value: 'One Time' },
  ];

  // Handle duration input change
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setDuration(value);
    }

    // Clear validation error when user starts typing
    if (validationErrors.duration) {
      setValidationErrors((prev) => ({ ...prev, duration: '' }));
    }
  };

  // Handle rate input change
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setRate(value);
    }

    // Clear validation error when user starts typing
    if (validationErrors.rate) {
      setValidationErrors((prev) => ({ ...prev, rate: '' }));
    }
  };

  // Handle description change
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Validate policy name
    if (!policyName.trim()) {
      errors.policyName = 'Policy name is required';
    }

    // Validate duration
    if (!duration.trim()) {
      errors.duration = 'Duration is required';
    } else if (parseInt(duration) <= 0) {
      errors.duration = 'Duration must be greater than 0';
    }

    // Validate rate
    if (!rate.trim()) {
      errors.rate = 'Rate is required';
    } else if (parseInt(rate) <= 0) {
      errors.rate = 'Rate must be greater than 0';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form after submission
  const resetForm = () => {
    setPolicyName('');
    setCycle('Monthly');
    setDuration('');
    setDurationUnit('Hours');
    setRateType('Flat Rate');
    setRate('');
    setFrequency('Daily');
    setDescription('');
    setFile(null);
    setValidationErrors({});
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true);

        // Prepare data for API
        const ptoData = {
          policy_name: policyName,
          cycle: cycle,
          duration: parseInt(duration),
          duration_unit: durationUnit,
          rate_type: rateType,
          rate: parseInt(rate),
          frequency: frequency,
          description: description,
        };

        console.log('Sending PTO policy data:', ptoData);

        // Mock API call for now
        // In a real app, you would call your API here
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Show success message
        toast.success('PTO policy added successfully!');

        // Reset form and close slider
        resetForm();
        setIsSliderOpen(false);
      } catch (err: any) {
        // Show error message
        toast.error(
          err.response?.data?.message || 'Failed to create PTO policy'
        );
        console.error('Error creating PTO policy:', err);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  return (
    <Slider
      edit={false}
      title={'Add PTO Policies'}
      buttonText="New Schedules"
      isOpen={isSliderOpen}
      onOpenChange={setIsSliderOpen}
      button={
        <Button
          text={'New Schedules'}
          type={'button'}
          icon={<i className="ri-file-add-line"></i>}
          onClick={() => setIsSliderOpen(true)}
        />
      }
    >
      <div className="flex flex-col gap-5 w-full max-w-4xl">
        <div>
          <p className="mb-2 font-medium">Policy Name</p>
          <Input
            placeholder="Enter policy name"
            value={policyName}
            onChange={(e) => setPolicyName(e.target.value)}
            error={validationErrors.policyName}
          />
        </div>

        <div>
          <p className="mb-2 font-medium">Cycle</p>
          <Select
            options={cycleOptions}
            selectedValue={cycle}
            onChange={(value) => setCycle(value)}
            bg={''}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <p className="mb-2 font-medium">Duration</p>
            <Input
              placeholder="Enter duration"
              value={duration}
              onChange={handleDurationChange}
              error={validationErrors.duration}
            />
          </div>
          <div className="flex-1">
            <p className="mb-2 font-medium">&nbsp;</p>
            <Select
              options={durationUnitOptions}
              selectedValue={durationUnit}
              onChange={(value ) => setDurationUnit(value)}
              bg={''}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="mb-2 font-medium">Rate Type</p>
            <Select
              options={rateTypeOptions}
              selectedValue={rateType}
              onChange={(value) => setRateType(value)}
              bg={''}
            />
          </div>
          <div>
            <CurrencyInput
              placeholder="Enter rate"
              label="Rate"
              value={rate}
              onChange={handleRateChange}
              error={validationErrors.rate}
            />
          </div>
          <div>
            <p className="mb-2 font-medium">Frequency</p>
            <Select
              options={frequencyOptions}
              selectedValue={frequency}
              onChange={(value) => setFrequency(value)}
              bg={''}
            />
          </div>
        </div>

        <div>
          <p className="mb-2 font-medium">Description</p>
          <textarea
            className="p-3 bg-white w-full border outline-none rounded-md"
            rows={5}
            placeholder="Enter description"
            value={description}
            onChange={handleDescriptionChange}
          ></textarea>
        </div>

        <div>
          <p className="mb-2 font-medium">Upload attachments</p>
          <div className='border-2 p-4'>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500 mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-500 text-sm"
                >
                  Browse files
                </label>
                {file && (
                  <p className="mt-2 text-sm text-gray-700">{file.name}</p>
                )}
              </div>
            </div>
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
