'use client';
import React, { useState, useEffect } from 'react';
import Select from '@potta/components/select';
import BenefitTable from './components/benefitTable';
import { toast } from 'react-hot-toast';
import Button from '@potta/components/button';
import { useBenefits } from './hooks/useBenefits';
import { useEmployeeBenefits } from './hooks/useEmployeeBenefits';

interface BenefitProps {
  personId?: string;
  onComplete?: () => void;
}

const Benefit: React.FC<BenefitProps> = ({ personId, onComplete }) => {
  // Fetch available benefits
  const { benefits: benefitOptions, loading: benefitsLoading } = useBenefits();

  // Manage employee benefits
  const {
    selectedBenefits,
    loading: employeeBenefitsLoading,
    saving: isSaving,
    hasChanges,
    isComplete,
    addBenefit,
    removeBenefit,
    saveBenefits,
  } = useEmployeeBenefits(personId);

  // Benefit selection state
  const [benefitSelectValue, setBenefitSelectValue] = useState<string>('');

  // Handle completion
  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  // Handle benefit selection
  const handleBenefitChange = (value: string) => {
    // If empty value, do nothing
    if (!value) {
      return;
    }

    setBenefitSelectValue(value);

    // Find the selected benefit
    const selectedBenefit = benefitOptions.find(
      (benefit) => benefit.name === value
    );

    if (selectedBenefit) {
      // Add benefit to selection
      addBenefit(selectedBenefit);

      // Reset select value
      setBenefitSelectValue('');
    } else {
      console.log('Could not find benefit with name:', value);
      // Reset select value if not found
      setBenefitSelectValue('');
    }
  };

  // Handle save
  const handleSave = async () => {
    await saveBenefits();

    // Show completion toast
    toast.success('Employee setup completed successfully!');
  };

  // Convert benefit options for select component
  const availableBenefitOptions = [
    { label: 'Select Benefit', value: '' },
    ...benefitOptions
      .filter(
        (benefit) =>
          !selectedBenefits.some((selected) => selected.uuid === benefit.uuid)
      )
      .map((benefit) => ({
        label: benefit.name || 'Unnamed Benefit',
        value: benefit.name || '',
      })),
  ];

  return (
    <div className="w-full pt-10 px-14">
      <div className="mt-5">
        <div className="">
          <p>Add Benefits</p>
          <Select
            options={availableBenefitOptions}
            selectedValue={benefitSelectValue}
            onChange={handleBenefitChange}
            bg={''}
          />
        </div>

        {/* Benefits table */}
        <div className="my-5">
          <BenefitTable benefits={selectedBenefits} onRemove={removeBenefit} />
        </div>

        {/* Save button - always show when personId is available */}
        {personId && (
          <div className="mt-6 flex justify-end">
            <Button
              type='submit'
              text={isSaving ? 'Saving...' : 'Save Benefits'}
              onClick={handleSave}
              disabled={
                isSaving || (!hasChanges && selectedBenefits.length > 0)
              }
            
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Benefit;
