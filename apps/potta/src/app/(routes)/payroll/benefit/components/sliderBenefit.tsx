'use client';
import Button from '@potta/components/button';
import Checkbox from '@potta/components/checkbox';
import CurrencyInput from '@potta/components/currencyInput';
import CustomDatePicker from '@potta/components/customDatePicker';
import Input from '@potta/components/input';
import SearchableSelect from '@potta/components/searchableSelect';
import Slider from '@potta/components/slideover';
import TextArea from '@potta/components/textArea';
import React, { useEffect } from 'react';
import { useBenefitForm } from '../hooks/useBenefitForm';
import {
  BENEFIT_TYPE_OPTIONS,
  CATEGORY_OPTIONS,
  CYCLE_OPTIONS,
  SALARY_CAP_OPTIONS,
} from '../constants/benefitCategories';

interface SliderBenefitProps {
  isEditMode?: boolean;
  editBenefitId?: string;
  editBenefit?: any;
  onComplete?: () => void;
  onClose?: () => void;
}

const SliderBenefit: React.FC<SliderBenefitProps> = ({
  isEditMode = false,
  editBenefitId,
  editBenefit,
  onComplete,
  onClose,
}) => {
  const {
    formData,
    expiryDate,
    isSliderOpen,
    isSubmitting,
    helpText,
    validationErrors,
    validationLimits,
    updateFormField,
    setExpiryDate,
    handleSubmit,
    openSlider,
    closeSlider,
    isLoading,
    isEditMode: hookEditMode,
    populateFormForEdit,
  } = useBenefitForm();

  // Effect to handle external edit mode
  useEffect(() => {
    if (isEditMode && editBenefit && !hookEditMode) {
      // Populate form with edit data
      populateFormForEdit(editBenefit);
      // Open slider if not already open
      if (!isSliderOpen) {
        openSlider();
      }
    }
  }, [
    isEditMode,
    editBenefit,
    hookEditMode,
    isSliderOpen,
    openSlider,
    populateFormForEdit,
  ]);

  // Handle close with external callback
  const handleClose = (value?: boolean) => {
    closeSlider(value);
    if (onClose) {
      onClose();
    }
  };

  // Handle form submission with external callback
  const handleFormSubmit = async (e?: React.FormEvent) => {
    await handleSubmit(e);
    if (onComplete) {
      onComplete();
    }
  };

  const {
    benefitName,
    benefitType,
    category,
    rateType,
    cycle,
    percentageValue,
    flatRateValue,
    salaryCap,
    customSalaryCap,
    taxCap,
    maxAmount,
    description,
    provider,
    isTaxable,
    isRoleBased,
    isDefault,
  } = formData;

  return (
    <Slider
      open={isSliderOpen}
      edit={false}
      setOpen={handleClose}
      title={hookEditMode ? 'Edit Benefit' : 'Add New Benefit'}
      buttonText="benefits"
    >
      <div className="space-y-6 w-full max-w-5xl">
        {/* Benefit Name */}
        <Input
          label="Benefit Name"
          type="text"
          name="benefitName"
          placeholder="Enter benefit name"
          value={benefitName}
          onchange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormField('benefitName', e.target.value)
          }
          errors={validationErrors.benefitName}
          required
        />
        {/* Provider */}
        <Input
          label="Provider"
          type="text"
          name="provider"
          placeholder="Enter benefit provider"
          value={provider}
          onchange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormField('provider', e.target.value)
          }
          errors={validationErrors.provider}
          required
        />

        {/* Benefit Type */}
        <div>
          <SearchableSelect
            label="Benefit Type"
            selectedValue={benefitType}
            onChange={(value) => updateFormField('benefitType', value)}
            options={BENEFIT_TYPE_OPTIONS}
            placeholder="Select benefit type"
            required
            error={validationErrors.benefitType}
          />
        </div>

        {/* Category */}
        <div>
          <SearchableSelect
            label="Category"
            selectedValue={category}
            onChange={(value) => updateFormField('category', value)}
            options={CATEGORY_OPTIONS}
            placeholder="Select category"
            required
            error={validationErrors.category}
          />
          {helpText && (
            <p className="text-xs text-gray-600 mt-1 italic">{helpText}</p>
          )}
        </div>

        {/* Rate Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rate Type */}
          <div>
            <SearchableSelect
              label="Rate Type"
              selectedValue={rateType}
              onChange={(value) => updateFormField('rateType', value)}
              options={[
                { label: 'Flat Rate', value: 'Flat Rate' },
                { label: 'Percentage', value: 'Percentage' },
              ]}
              placeholder="Select rate type"
              required
              error={validationErrors.rateType}
              isDisabled={[
                'Seniority Bonus',
                'Risk Allowance',
                'Overtime Pay',
                'Performance Bonus',
                'Sales Commission',
                'Hardship Allowance',
                '13th Month Salary',
              ].includes(category)}
            />
          </div>

          {/* Cycle */}
          <div>
            <SearchableSelect
              label="Cycle"
              selectedValue={cycle}
              onChange={(value) => updateFormField('cycle', value)}
              options={CYCLE_OPTIONS}
              placeholder="Select cycle"
              required
              error={validationErrors.cycle}
              isDisabled={[
                'Seniority Bonus',
                'Housing Allowance',
                'Meal Allowance',
                'Transport Allowance',
                'Family Allowance',
                'Risk Allowance',
                'Overtime Pay',
                'Performance Bonus',
                'Sales Commission',
                'Hardship Allowance',
                '13th Month Salary',
              ].includes(category)}
            />
          </div>

          {category === 'Meal Allowance' && (
            <div className="col-span-2">
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                <strong>Note:</strong> Meal allowance is calculated per working
                day. The system will automatically calculate based on working
                days per month.
              </p>
            </div>
          )}
        </div>

        {/* Rate Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Percentage Value */}
          {rateType === 'Percentage' && (
            <Input
              label={`Percentage (${validationLimits.minPercentage}% - ${validationLimits.maxPercentage}%)`}
              type="number"
              name="percentageValue"
              placeholder="Enter percentage"
              value={percentageValue}
              onchange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormField('percentageValue', e.target.value)
              }
              errors={validationErrors.percentageValue}
              required
            />
          )}

          {/* Flat Rate Value */}
          {rateType === 'Flat Rate' && (
            <CurrencyInput
              label={`Rate Amount (XAF ${validationLimits.minFlatRate.toLocaleString()} - ${validationLimits.maxFlatRate.toLocaleString()})`}
              placeholder="Enter amount"
              value={flatRateValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormField('flatRateValue', e.target.value)
              }
              error={validationErrors.flatRateValue}
              required
            />
          )}

          {/* Salary Cap for Percentage */}
          {rateType === 'Percentage' && (
            <div>
              <SearchableSelect
                label="Salary Cap"
                selectedValue={salaryCap}
                onChange={(value) => updateFormField('salaryCap', value)}
                options={SALARY_CAP_OPTIONS}
                placeholder="Select salary cap"
                required
                error={validationErrors.salaryCap}
              />
              {salaryCap === 'Custom' && (
                <div className="mt-2">
                  <Input
                    label="Custom Salary Cap"
                    type="text"
                    name="customSalaryCap"
                    placeholder="Enter custom salary cap"
                    value={customSalaryCap}
                    onchange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateFormField('customSalaryCap', e.target.value)
                    }
                    errors={validationErrors.customSalaryCap}
                    required
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tax Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Taxable Toggle */}
          <div>
            <Checkbox
              id="isTaxable"
              label="Taxable"
              checked={isTaxable}
              onChange={(checked) => updateFormField('isTaxable', checked)}
              className={
                [
                  'Meal Allowance',
                  'Transport Allowance',
                  'Family Allowance',
                ].includes(category)
                  ? 'opacity-50 pointer-events-none'
                  : ''
              }
            />
          </div>

          {/* Tax Cap */}
          {isTaxable && (
            <CurrencyInput
              label="Tax Cap"
              placeholder="Enter tax cap amount"
              value={taxCap}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormField('taxCap', e.target.value)
              }
              error={validationErrors.taxCap}
            />
          )}
        </div>

        {/* Additional Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Max Amount */}
          <CurrencyInput
            label="Max Amount"
            placeholder="Enter maximum amount"
            value={maxAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormField('maxAmount', e.target.value)
            }
            error={validationErrors.maxAmount}
          />

          {/* Expiry Date */}
          <CustomDatePicker
            label="Expiry Date"
            placeholder="Select expiry date"
            value={expiryDate}
            onChange={setExpiryDate}
            errors={validationErrors.expiryDate}
          />
        </div>

        {/* Role-based and Default toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Checkbox
              id="isRoleBased"
              label="Role-based"
              checked={isRoleBased}
              onChange={(checked) => updateFormField('isRoleBased', checked)}
            />
          </div>

          <div>
            <Checkbox
              id="isDefault"
              label="Default benefit"
              checked={isDefault}
              onChange={(checked) => updateFormField('isDefault', checked)}
            />
          </div>
        </div>

        {/* Description */}
        <TextArea
          label="Description"
          name="description"
          placeholder="Enter benefit description"
          value={description}
          onchange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            updateFormField('description', e.target.value)
          }
          errors={validationErrors.description}
        />

        <Button
          type="submit"
          text={
            isSubmitting
              ? isEditMode
                ? 'Updating...'
                : 'Adding...'
              : isEditMode
              ? 'Update Benefit'
              : 'Add Benefit'
          }
          disabled={isSubmitting || isLoading}
          onClick={handleFormSubmit}
        />
      </div>
    </Slider>
  );
};

export default SliderBenefit;
