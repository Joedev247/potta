'use client';
import Button from '@potta/components/button';
import CurrencyInput from '@potta/components/currencyInput';
import CustomDatePicker from '@potta/components/customDatePicker';
import Input from '@potta/components/input';
import Select from '@potta/components/select';
import Slider from '@potta/components/slideover';
import React, { useState, useEffect } from 'react';
import { CalendarDate, today } from '@internationalized/date';
import { useCreateBenefit } from '../hooks/useCreateBenefit';
import { BenefitPayload, BenefitType, CycleType } from '../utils/types';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const SliderBenefit = () => {
  const [benefitType, setBenefitType] = useState('Financial');
  const [rateType, setRateType] = useState('Flat Rate');
  const [cycle, setCycle] = useState('MONTHLY');
  const [isTaxable, setIsTaxable] = useState(true);
  const [expiryDate, setExpiryDate] = useState<CalendarDate | null>(null);
  const [category, setCategory] = useState('Seniority Bonus');
  const [percentageValue, setPercentageValue] = useState('');
  const [flatRateValue, setFlatRateValue] = useState('');
  const [salaryCap, setSalaryCap] = useState('100000');
  const [customSalaryCap, setCustomSalaryCap] = useState('');
  const [minPercentage, setMinPercentage] = useState(0);
  const [maxPercentage, setMaxPercentage] = useState(100);
  const [minFlatRate, setMinFlatRate] = useState(0);
  const [maxFlatRate, setMaxFlatRate] = useState(1000000);
  const [helpText, setHelpText] = useState('');
  const [benefitName, setBenefitName] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [taxCap, setTaxCap] = useState('');
  const [description, setDescription] = useState('');
  const [isRoleBased, setIsRoleBased] = useState(false);
  const [isDefault, setIsDefault] = useState(true);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  // Use the custom hook for creating benefits
  const { createBenefit, isLoading, error, success } = useCreateBenefit();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Benefit type options
  const benefitTypeOptions = [
    { label: 'Financial', value: 'Financial' },
    { label: 'Service', value: 'Service' },
    { label: 'Redeemable', value: 'Redeemable' },
  ];

  // Category options based on the payroll document
  const categoryOptions = [
    { label: 'Base Salary', value: 'Base Salary' },
    { label: 'Seniority Bonus', value: 'Seniority Bonus' },
    { label: 'Responsibility Allowance', value: 'Responsibility Allowance' },
    { label: 'Dirt Allowance', value: 'Dirt Allowance' },
    { label: 'Milk Allowance', value: 'Milk Allowance' },
    { label: 'Encouragement Bonus', value: 'Encouragement Bonus' },
    { label: 'Meal Allowance', value: 'Meal Allowance' },
    { label: 'Housing Allowance', value: 'Housing Allowance' },
    { label: 'Transport Allowance', value: 'Transport Allowance' },
    { label: 'Family Allowance', value: 'Family Allowance' },
    { label: 'Risk Allowance', value: 'Risk Allowance' },
    { label: 'Overtime Pay', value: 'Overtime Pay' },
    { label: 'Performance Bonus', value: 'Performance Bonus' },
    { label: 'Sales Commission', value: 'Sales Commission' },
    { label: 'Hardship Allowance', value: 'Hardship Allowance' },
    { label: '13th Month Salary', value: '13th Month Salary' },
    { label: 'Other', value: 'Other' },
  ];

  // Provider options
  const providerOptions = [
    { label: 'CNPS', value: 'CNPS' },
    { label: 'Company', value: 'Company' },
    { label: 'FNH', value: 'FNH' },
    { label: 'External', value: 'External' },
  ];

  // Rate type options
  const rateTypeOptions = [
    { label: 'Flat Rate', value: 'Flat Rate' },
    { label: 'Percentage', value: 'Percentage' },
  ];

  const cycleOptions = [
    { label: 'Daily', value: 'DAILY' },
    { label: 'Weekly', value: 'WEEKLY' },
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Annually', value: 'ANNUALLY' },
    { label: 'One Time', value: 'ONETIME' },
    { label: 'None', value: 'NONE' },
  ];

  // Salary cap options for when rate type is percentage - removed Base Salary and Gross Salary
  const salaryCapOptions = [
    { label: '100,000 XAF', value: '100000' },
    { label: '250,000 XAF', value: '250000' },
    { label: '500,000 XAF', value: '500000' },
    { label: '1,000,000 XAF', value: '1000000' },
    { label: 'Custom Cap', value: 'Custom' },
  ];

  // Then in your useEffect for category changes:
  useEffect(() => {
    // Set default benefit name based on category
    setBenefitName(category);

    // Reset values when category changes
    setPercentageValue('');
    setFlatRateValue('');
    setValidationErrors({});
    setCustomSalaryCap('');
    // Always default to a numeric salary cap value
    setSalaryCap('100000');

    switch (category) {
      case 'Base Salary':
        setRateType('Flat Rate');
        setCycle('MONTHLY'); // Using correct backend value
        setIsTaxable(true);
        setMinFlatRate(41875); // Minimum wage in Cameroon
        setMaxFlatRate(10000000);
        setHelpText(
          'Cannot be lower than the legal minimum wage (SMIG): XAF 41,875'
        );
        break;

      case 'Seniority Bonus':
        setRateType('Percentage');
        setCycle('MONTHLY'); // Using correct backend value
        setIsTaxable(true);
        setMinPercentage(2);
        setMaxPercentage(8);
        setHelpText(
          '2-5 years: 2%, 6-10 years: 3%, 11-15 years: 5%, 16-20 years: 8% of Base Salary'
        );
        break;

      case 'Responsibility Allowance':
        setRateType('Percentage');
        setCycle('MONTHLY'); // Using correct backend value
        setIsTaxable(true);
        setMinPercentage(5);
        setMaxPercentage(20);
        setHelpText('5% - 20% of base salary, depending on job level');
        break;

      case 'Dirt Allowance':
        setRateType('Flat Rate');
        setCycle('MONTHLY'); // Using correct backend value
        setIsTaxable(true);
        setMinFlatRate(5000);
        setMaxFlatRate(25000);
        setHelpText('XAF 5,000 - 25,000 per month (varies by company)');
        break;

      case 'Milk Allowance':
        setRateType('Flat Rate');
        setCycle('MONTHLY'); // Using correct backend value
        setIsTaxable(false);
        setMinFlatRate(5000);
        setMaxFlatRate(20000);
        setHelpText(
          'XAF 5,000 - 20,000 per month. Not taxable (considered a health benefit)'
        );
        break;

      case 'Encouragement Bonus':
        setRateType('Percentage');
        setCycle('MONTHLY'); // Using correct backend value
        setIsTaxable(true);
        setMinPercentage(5);
        setMaxPercentage(50);
        setHelpText('5% - 50% of base salary depending on performance');
        break;

      case 'Meal Allowance':
        setRateType('Flat Rate');
        setCycle('DAILY'); // Using correct backend value
        setIsTaxable(false);
        setMinFlatRate(1000);
        setMaxFlatRate(2500);
        setHelpText(
          'XAF 1,000 - 2,500 per working day. Not taxable (considered a benefit)'
        );
        break;

      case 'Housing Allowance':
        setRateType('Percentage');
        setCycle('MONTHLY'); // Using correct backend value
        setIsTaxable(true);
        setMinPercentage(15);
        setMaxPercentage(30);
        setHelpText('15% - 30% of base salary (varies by sector & contract)');
        break;

      case 'Transport Allowance':
        setRateType('Flat Rate');
        setCycle('MONTHLY'); // Using correct backend value
        setIsTaxable(false);
        setMinFlatRate(20000);
        setMaxFlatRate(50000);
        setHelpText('XAF 20,000 - 50,000 per month. Not taxable');
        break;

      case 'Family Allowance':
        setRateType('Flat Rate');
        setCycle('MONTHLY'); // Using correct backend value
        setIsTaxable(false);
        setMinFlatRate(2800);
        setMaxFlatRate(2800);
        setHelpText('XAF 2,800 per child per month (managed by CNPS)');
        break;

      case 'Risk Allowance':
        setRateType('Percentage');
        setCycle('MONTHLY'); // Using correct backend value
        setIsTaxable(true);
        setMinPercentage(5);
        setMaxPercentage(30);
        setHelpText(
          '5% - 30% of base salary. Applicable to healthcare workers, security staff, mining, construction, etc.'
        );
        break;

      case 'Overtime Pay':
        setRateType('Percentage');
        setCycle('DAILY'); // Using correct backend value
        setIsTaxable(true);
        setMinPercentage(25);
        setMaxPercentage(100);
        setHelpText(
          'Weekdays: +25%, Saturdays: +50%, Sundays & Public Holidays: +100% per hour'
        );
        break;

      case 'Performance Bonus':
        setRateType('Percentage');
        setCycle('MONTHLY'); // Using correct backend value
        setIsTaxable(true);
        setMinPercentage(5);
        setMaxPercentage(50);
        setHelpText(
          '5% - 50% of base salary. Based on individual or team performance'
        );
        break;

      case 'Sales Commission':
        setRateType('Percentage');
        setCycle('MONTHLY'); // Using correct backend value
        setIsTaxable(true);
        setMinPercentage(1);
        setMaxPercentage(20);
        setHelpText('Usually a percentage of sales revenue');
        break;

      case 'Hardship Allowance':
        setRateType('Percentage');
        setCycle('MONTHLY'); // Using correct backend value
        setIsTaxable(true);
        setMinPercentage(5);
        setMaxPercentage(25);
        setHelpText(
          '5% - 25% of base salary. Paid for working in remote or harsh environments'
        );
        break;

      case '13th Month Salary':
        setRateType('Percentage');
        setCycle('ANNUALLY'); // Using correct backend value
        setIsTaxable(true);
        setMinPercentage(100);
        setMaxPercentage(100);
        setHelpText(
          "Equal to one month's base salary. Usually paid at the end of the year"
        );
        break;

      default:
        setRateType('Flat Rate');
        setCycle('MONTHLY'); // Using correct backend value
        setIsTaxable(true);
        setMinFlatRate(0);
        setMaxFlatRate(1000000);
        setMinPercentage(0);
        setMaxPercentage(100);
        setHelpText('');
        break;
    }

    // Update description when helpText changes
    setDescription(helpText);
  }, [category]);
  // Update description when helpText changes outside of category change
  useEffect(() => {
    setDescription(helpText);
  }, [helpText]);

  // Handle percentage input change
  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPercentageValue(value);

    // Clear validation error when user starts typing
    if (validationErrors.percentageValue) {
      setValidationErrors((prev) => ({ ...prev, percentageValue: '' }));
    }
  };

  // Handle flat rate input change
  const handleFlatRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFlatRateValue(value);

    // Clear validation error when user starts typing
    if (validationErrors.flatRateValue) {
      setValidationErrors((prev) => ({ ...prev, flatRateValue: '' }));
    }
  };

  // Handle tax cap input change
  const handleTaxCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTaxCap(value);

    // Clear validation error when user starts typing
    if (validationErrors.taxCap) {
      setValidationErrors((prev) => ({ ...prev, taxCap: '' }));
    }
  };

  // Handle max amount input change
  const handleMaxAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxAmount(value);

    // Clear validation error when user starts typing
    if (validationErrors.maxAmount) {
      setValidationErrors((prev) => ({ ...prev, maxAmount: '' }));
    }
  };

  // Handle custom salary cap input change
  const handleCustomSalaryCapChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCustomSalaryCap(value);

    // Clear validation error when user starts typing
    if (validationErrors.customSalaryCap) {
      setValidationErrors((prev) => ({ ...prev, customSalaryCap: '' }));
    }
  };

  // Handle description change
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  // Convert UI values to API format
  const mapBenefitTypeToAPI = (type: string): BenefitType => {
    switch (type) {
      case 'Financial':
        return 'FINANCIAL';
      case 'Service':
        return 'SERVICE';
      case 'Redeemable':
        return 'REDEEMABLE';
      default:
        return 'FINANCIAL';
    }
  };

  const mapCycleToAPI = (cycleValue: string): CycleType => {
    switch (cycleValue) {
      case 'Daily':
        return 'DAILY';
      case 'Weekly':
        return 'WEEKLY';
      case 'Monthly':
        return 'MONTHLY';
      case 'Quarterly':
        return 'QUARTERLY';
      case 'Annually':
        return 'ANNUALLY';
      case 'OneTime':
        return 'ONE_TIME';
      case 'None':
        return 'NONE';
      default:
        return 'MONTHLY';
    }
  };

  // Get salary cap value based on selection
  const getSalaryCapValue = (): number => {
    if (salaryCap === 'Custom') {
      return customSalaryCap
        ? parseFloat(customSalaryCap.replace(/[^0-9.]/g, ''))
        : 100000; // Default to 100,000 if no custom value
    } else {
      return parseFloat(salaryCap);
    }
  };

  // Validate all inputs when Add Benefit button is clicked
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Validate benefit name
    if (!benefitName.trim()) {
      errors.benefitName = 'Benefit name is required';
    }

    // Validate rate based on type
    if (rateType === 'Percentage') {
      const numValue = parseFloat(percentageValue);
      if (!percentageValue.trim()) {
        errors.percentageValue = 'Percentage value is required';
      } else if (isNaN(numValue)) {
        errors.percentageValue = 'Please enter a valid number';
      } else if (numValue < minPercentage) {
        errors.percentageValue = `Value must be at least ${minPercentage}%`;
      } else if (numValue > maxPercentage) {
        errors.percentageValue = `Value cannot exceed ${maxPercentage}%`;
      }

      // Validate custom salary cap if selected
      if (salaryCap === 'Custom' && !customSalaryCap.trim()) {
        errors.customSalaryCap = 'Custom salary cap is required';
      } else if (salaryCap === 'Custom') {
        const numValue = parseFloat(customSalaryCap.replace(/[^0-9.]/g, ''));
        if (isNaN(numValue) || numValue <= 0) {
          errors.customSalaryCap = 'Please enter a valid salary cap amount';
        }
      }
    } else {
      // Flat Rate validation
      const numValue = parseFloat(flatRateValue.replace(/[^0-9.]/g, ''));
      if (!flatRateValue.trim()) {
        errors.flatRateValue = 'Rate amount is required';
      } else if (isNaN(numValue)) {
        errors.flatRateValue = 'Please enter a valid number';
      } else if (numValue < minFlatRate) {
        errors.flatRateValue = `Value must be at least XAF ${minFlatRate.toLocaleString()}`;
      } else if (numValue > maxFlatRate) {
        errors.flatRateValue = `Value cannot exceed XAF ${maxFlatRate.toLocaleString()}`;
      }
    }

    // Validate tax cap if taxable
    if (isTaxable && taxCap.trim()) {
      const numValue = parseFloat(taxCap.replace(/[^0-9.]/g, ''));
      if (isNaN(numValue) || numValue < 0) {
        errors.taxCap = 'Please enter a valid tax cap amount';
      }

      // For percentage-based benefits, ensure tax cap doesn't exceed the value
      if (rateType === 'Percentage') {
        // No validation needed here as we'll set a high value
      } else {
        // For flat rate, ensure tax cap doesn't exceed the flat rate value
        const flatRateVal = parseFloat(flatRateValue.replace(/[^0-9.]/g, ''));
        if (!isNaN(flatRateVal) && numValue > flatRateVal) {
          errors.taxCap = 'Tax cap cannot exceed the rate amount';
        }
      }
    }

    // Validate max amount if provided
    if (maxAmount.trim()) {
      const numValue = parseFloat(maxAmount.replace(/[^0-9.]/g, ''));
      if (isNaN(numValue) || numValue < 0) {
        errors.maxAmount = 'Please enter a valid maximum amount';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form after submission
  const resetForm = () => {
    setBenefitName('');
    setPercentageValue('');
    setFlatRateValue('');
    setTaxCap('');
    setMaxAmount('');
    setExpiryDate(null);
    setValidationErrors({});
    setCategory('Seniority Bonus');
    setBenefitType('Financial');
    setRateType('Flat Rate');
    setCycle('MONTHLY');
    setIsTaxable(true);
    setSalaryCap('100000'); // Set to a numeric value instead of 'Base Salary'
    setCustomSalaryCap('');
    setDescription('');
    setIsRoleBased(false);
    setIsDefault(true);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Set loading state to true
        setIsSubmitting(true);

        // Prepare data for API
        const benefitData: BenefitPayload = {
          name: benefitName,
          description: description,
          type: mapBenefitTypeToAPI(benefitType),
          cycle: mapCycleToAPI(cycle),
          is_taxable: isTaxable,
          provider: category === 'Family Allowance' ? 'CNPS' : 'Company',
          is_default: isDefault,
          role_based: isRoleBased,
        };

        // Add rate type specific values
        if (rateType === 'Percentage') {
          // For percentage-based benefits
          benefitData.rate = parseFloat(percentageValue) / 100; // Convert to decimal

          // For percentage-based benefits, set value to a high number to satisfy tax_cap validation
          benefitData.value = 1000000000; // A very high value that will be greater than any tax_cap

          // Set salary_cap
          benefitData.salary_cap = getSalaryCapValue();

          // Set max_amount if provided
          if (maxAmount) {
            benefitData.max_amount = parseFloat(
              maxAmount.replace(/[^0-9.]/g, '')
            );
          }
        } else {
          // For flat rate benefits
          benefitData.value = parseFloat(flatRateValue.replace(/[^0-9.]/g, ''));
          benefitData.rate = 0; // Set rate to 0 for flat-rate benefits
        }

        // Add tax cap if applicable
        if (isTaxable && taxCap) {
          const taxCapValue = parseFloat(taxCap.replace(/[^0-9.]/g, ''));

          // For percentage-based benefits, we can set any tax_cap since value is very high
          if (rateType === 'Percentage') {
            benefitData.tax_cap = taxCapValue;
          } else {
            // For flat rate, ensure tax_cap <= value
            if (taxCapValue <= benefitData.value) {
              benefitData.tax_cap = taxCapValue;
            } else {
              // If tax_cap would be greater than value, set it equal to value
              benefitData.tax_cap = benefitData.value;
            }
          }
        }

        // Add expiry date for redeemable benefits
        if (benefitType === 'Redeemable' && expiryDate) {
          const year = expiryDate.year;
          const month = expiryDate.month;
          const day = expiryDate.day;
          const dateObj = new Date(year, month - 1, day, 23, 59, 59);
          benefitData.expires_at = dateObj.toISOString();
        }

        // If role-based, add eligible roles
        if (isRoleBased) {
          benefitData.eligible_roles = []; // This should be populated with selected roles
        }

        // Clean up the payload by removing any undefined values
        Object.keys(benefitData).forEach((key) => {
          if (benefitData[key as keyof BenefitPayload] === undefined) {
            delete benefitData[key as keyof BenefitPayload];
          }
        });

        console.log('Sending benefit data:', benefitData);

        // Call API to create benefit
        await createBenefit(benefitData);

        // Show success message
        toast.success('Benefit added successfully!');

        // Reset form and close slider
        resetForm();
        setIsSliderOpen(false);
      } catch (err: any) {
        // Show error message
        toast.error(err.response?.data?.message || 'Failed to create benefit');
        console.error('Error creating benefit:', err);
      } finally {
        // Set loading state back to false
        setIsSubmitting(false);
      }
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  return (
    <Slider
      edit={false}
      title={'New Benefits'}
      buttonText="benefits"
      isOpen={isSliderOpen}
      onOpenChange={setIsSliderOpen}
    >
      <div className="flex min-w-[1100px] flex-col gap-5">
        <div>
          <p className="mb-2 font-bold">Benefit Type</p>
          <Select
            options={benefitTypeOptions}
            selectedValue={benefitType}
            onChange={(value) => setBenefitType(value)}
            bg={''}
          />
        </div>

        <div>
          <p className="mb-2 font-bold">Category</p>
          <Select
            options={categoryOptions}
            selectedValue={category}
            onChange={(value) => setCategory(value)}
            bg={''}
          />
          {helpText && (
            <p className="text-xs text-gray-600 mt-1 italic">{helpText}</p>
          )}
        </div>

        <div>
          <p className="mb-2 font-bold">Provider</p>
          <Select
            options={providerOptions}
            selectedValue={category === 'Family Allowance' ? 'CNPS' : 'Company'}
            onChange={() => {}}
            bg={''}
            isDisabled={category === 'Family Allowance'}
          />
          {category === 'Family Allowance' && (
            <p className="text-xs text-gray-600 mt-1 italic">
              Family Allowance is managed by CNPS
            </p>
          )}
        </div>

        {/* Rate Type Section with fixed width layout */}
        <div className="flex flex-col space-y-4">
          <div className="flex">
            <div className="w-1/3 pr-4">
              <p className="mb-2 font-bold">Rate Type</p>
              <Select
                options={rateTypeOptions}
                selectedValue={rateType}
                onChange={(value) => setRateType(value)}
                bg={''}
                isDisabled={[
                  'Family Allowance',
                  'Seniority Bonus',
                  'Housing Allowance',
                  'Risk Allowance',
                  'Overtime Pay',
                  '13th Month Salary',
                ].includes(category)}
              />
            </div>

            {/* Fixed width container for rate inputs */}
            <div className="w-2/3">
              {/* Both rate type inputs have the same container */}
              <div className="w-full">
                {rateType === 'Flat Rate' ? (
                  <div>
                    <CurrencyInput
                      label="Rate Amount "
                      placeholder={minFlatRate.toString()}
                      inputClass="!bg-gray-50"
                      value={flatRateValue}
                      onChange={handleFlatRateChange}
                      error={validationErrors.flatRateValue}
                      onKeyDown={(e) => {
                        // Allow numeric input, backspace, delete, arrow keys
                        if (
                          !/[0-9]/.test(e.key) &&
                          e.key !== 'Backspace' &&
                          e.key !== 'Delete' &&
                          e.key !== 'ArrowLeft' &&
                          e.key !== 'ArrowRight' &&
                          e.key !== 'Tab' &&
                          e.key !== '.' &&
                          !e.ctrlKey // Allow Ctrl+C, Ctrl+V, etc.
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                    {!validationErrors.flatRateValue && (
                      <p className="text-xs absolute text-gray-600 mt-1">
                        Range: XAF {minFlatRate.toLocaleString()} - XAF{' '}
                        {maxFlatRate.toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium mb-1 mt-2">
                        Percentage (%)
                      </label>
                      <input
                        type="number"
                        className={`w-full p-2 py-[10px] bg-gray-50 border outline-none focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500
    ${validationErrors.percentageValue ? 'border-red-500' : ''}`}
                        placeholder={minPercentage.toString()}
                        value={percentageValue}
                        onChange={handlePercentageChange}
                        step="any"
                      />
                      {validationErrors.percentageValue && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.percentageValue}
                        </p>
                      )}
                      {!validationErrors.percentageValue && (
                        <p className="text-xs text-gray-600 mt-1">
                          Range: {minPercentage}% - {maxPercentage}%
                        </p>
                      )}
                    </div>
                    <div className="w-1/2">
                      <p className="mb-2 font-bold">Salary Cap</p>
                      <Select
                        options={salaryCapOptions}
                        selectedValue={salaryCap}
                        onChange={(value) => setSalaryCap(value)}
                        bg={''}
                        isDisabled={[
                          'Seniority Bonus',
                          'Responsibility Allowance',
                          'Housing Allowance',
                          'Risk Allowance',
                          '13th Month Salary',
                        ].includes(category)}
                      />
                      {salaryCap === 'Custom' && (
                        <div className="mt-2">
                          <CurrencyInput
                            label="Custom Cap "
                            placeholder="Enter custom salary cap"
                            inputClass="!bg-gray-50"
                            value={customSalaryCap}
                            onChange={handleCustomSalaryCapChange}
                            error={validationErrors.customSalaryCap}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2 font-bold">Frequency</p>
            <Select
              options={cycleOptions}
              selectedValue={cycle}
              onChange={(value) => setCycle(value)}
              bg={''}
              isDisabled={[
                'Meal Allowance',
                'Overtime Pay',
                '13th Month Salary',
              ].includes(category)}
            />

            {category === 'Meal Allowance' && (
              <p className="text-xs text-gray-600 mt-1 italic">
                Meal allowance is paid daily
              </p>
            )}
            {category === 'Overtime Pay' && (
              <p className="text-xs text-gray-600 mt-1 italic">
                Overtime is calculated daily
              </p>
            )}
            {category === '13th Month Salary' && (
              <p className="text-xs text-gray-600 mt-1 italic">
                13th month salary is paid annually
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id="isTaxable"
                checked={isTaxable}
                onChange={() => setIsTaxable(!isTaxable)}
                className="h-4 w-4"
                disabled={
                  [
                    'Milk Allowance',
                    'Meal Allowance',
                    'Transport Allowance',
                    'Family Allowance',
                  ].includes(category) ||
                  [
                    'Base Salary',
                    'Seniority Bonus',
                    'Responsibility Allowance',
                    'Dirt Allowance',
                    'Encouragement Bonus',
                    'Housing Allowance',
                    'Risk Allowance',
                    'Overtime Pay',
                    'Performance Bonus',
                    'Sales Commission',
                    'Hardship Allowance',
                    '13th Month Salary',
                  ].includes(category)
                }
              />
              <label htmlFor="isTaxable" className="text-sm font-medium">
                Is Taxable
              </label>
            </div>
            {[
              'Milk Allowance',
              'Meal Allowance',
              'Transport Allowance',
              'Family Allowance',
            ].includes(category) && (
              <p className="text-xs text-gray-600 mt-1 italic">
                This benefit is not taxable by law
              </p>
            )}
            {[
              'Base Salary',
              'Seniority Bonus',
              'Responsibility Allowance',
              'Dirt Allowance',
              'Encouragement Bonus',
              'Housing Allowance',
              'Risk Allowance',
              'Overtime Pay',
              'Performance Bonus',
              'Sales Commission',
              'Hardship Allowance',
              '13th Month Salary',
            ].includes(category) && (
              <p className="text-xs text-gray-600 mt-1 italic">
                This benefit is taxable by law
              </p>
            )}
          </div>
        </div>

        {isTaxable && (
          <div>
            <CurrencyInput
              label="Tax Cap "
              placeholder="Enter tax cap"
              inputClass="!bg-gray-50"
              value={taxCap}
              onChange={handleTaxCapChange}
              error={validationErrors.taxCap}
            />
            <p className="text-xs text-gray-600 mt-1">
              Maximum taxable value if partially taxable
            </p>
          </div>
        )}

        {category !== 'Family Allowance' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Only show Maximum Amount for percentage-based benefits */}
            {rateType === 'Percentage' && (
              <div>
                <CurrencyInput
                  label="Maximum Amount "
                  placeholder="Enter maximum amount"
                  inputClass="!bg-gray-50"
                  value={maxAmount}
                  onChange={handleMaxAmountChange}
                  error={validationErrors.maxAmount}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Maximum amount to pay regardless of percentage calculation
                </p>
              </div>
            )}
            {/* Maintain consistent layout by adding an empty div when needed */}
            {rateType !== 'Percentage' &&
              !benefitType.includes('Redeemable') && <div></div>}
            {benefitType === 'Redeemable' && (
              <div>
                <p className="mb-2 font-bold">Expiry Date</p>
                <CustomDatePicker
                  label=""
                  placeholder="Select expiry date"
                  value={expiryDate}
                  onChange={setExpiryDate}
                />
              </div>
            )}
          </div>
        )}

        {/* Additional options for role-based benefits and default status
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isRoleBased"
              checked={isRoleBased}
              onChange={() => setIsRoleBased(!isRoleBased)}
              className="h-4 w-4"
            />
            <label htmlFor="isRoleBased" className="text-sm font-medium">
              Role-based Benefit
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={() => setIsDefault(!isDefault)}
              className="h-4 w-4"
            />
            <label htmlFor="isDefault" className="text-sm font-medium">
              Default Benefit
            </label>
          </div>
        </div> */}

        <div>
          <p className="mb-2 font-bold">Description</p>
          <textarea
            className="p-3 bg-gray-50 w-full border outline-none rounded-md"
            rows={5}
            placeholder="Enter detailed description of the benefit"
            value={description}
            onChange={handleDescriptionChange}
          ></textarea>
        </div>

        <div className="flex justify-end">
          <Button
            text={isSubmitting || isLoading ? 'Adding...' : 'Add Benefit'}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">Error: {error}</div>
        )}
      </div>
    </Slider>
  );
};

export default SliderBenefit;
