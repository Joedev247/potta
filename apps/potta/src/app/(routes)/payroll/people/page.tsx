'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import BaseInfo from './components/baseInfo';
import Address from './components/address';
import BankAccount from './components/bankAccount';
import Compensation from './components/compensation';
import EmployeeTaxInformation from './components/employee_tax_information';
import Benefit from './components/benefit/page';
import Schedule from './components/schedule';
import RootLayout from '../../layout';
import Button from '@potta/components/button';
import { peopleApi } from './utils/api';
import {
  BaseInfoPayload,
  AddressPayload,
  CompensationPayload,
  SchedulePayload,
  BenefitPayload,
  TaxInfoPayload,
  PersonPayload,
  BankAccountPayload,
} from './utils/types';

// Main component
const People = () => {
  const [active, setActive] = useState('ebi');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [personId, setPersonId] = useState<string | null>(null);
  const [personData, setPersonData] = useState<any>(null);

  // State for form data
  const [baseInfo, setBaseInfo] = useState<BaseInfoPayload | null>(null);
  const [address, setAddress] = useState<AddressPayload | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccountPayload | null>(
    null
  );
  const [compensation, setCompensation] = useState<CompensationPayload | null>(
    null
  );
  const [schedule, setSchedule] = useState<SchedulePayload | null>(null);
  const [benefit, setBenefit] = useState<BenefitPayload | null>(null);
  const [taxInfo, setTaxInfo] = useState<TaxInfoPayload | null>(null);

  // Add a key to force re-render of child components when data changes
  const [formKey, setFormKey] = useState(0);

  // Load saved personId from localStorage on initial render
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Load personId
      const savedPersonId = localStorage.getItem('potta_personId');
      if (savedPersonId) {
        setPersonId(savedPersonId);
      }

      // Load last active step
      const savedActiveStep = localStorage.getItem('potta_activeStep');
      if (savedActiveStep) {
        setActive(savedActiveStep);
      }

      // Try to load saved form data if available
      try {
        const savedBaseInfo = localStorage.getItem('potta_baseInfo');
        if (savedBaseInfo) {
          setBaseInfo(JSON.parse(savedBaseInfo));
        }

        const savedAddress = localStorage.getItem('potta_address');
        if (savedAddress) {
          setAddress(JSON.parse(savedAddress));
        }

        const savedBankAccount = localStorage.getItem('potta_bankAccount');
        if (savedBankAccount) {
          setBankAccount(JSON.parse(savedBankAccount));
        }

        const savedCompensation = localStorage.getItem('potta_compensation');
        if (savedCompensation) {
          setCompensation(JSON.parse(savedCompensation));
        }

        const savedSchedule = localStorage.getItem('potta_schedule');
        if (savedSchedule) {
          setSchedule(JSON.parse(savedSchedule));
        }

        const savedBenefit = localStorage.getItem('potta_benefit');
        if (savedBenefit) {
          setBenefit(JSON.parse(savedBenefit));
        }

        const savedTaxInfo = localStorage.getItem('potta_taxInfo');
        if (savedTaxInfo) {
          setTaxInfo(JSON.parse(savedTaxInfo));
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  // Fetch person data whenever personId changes or when navigating back to previous steps
  useEffect(() => {
    if (personId) {
      fetchPersonData();
    }
  }, [personId, active]);

  const fetchPersonData = async () => {
    if (!personId) return;

    setIsFetching(true);
    try {
      const data = await peopleApi.getPerson(personId);
      setPersonData(data);
      console.log('Fetched person data:', data);

      // Update form data based on fetched data
      if (data) {
        // Update base info
        if (active === 'ebi' || active === 'el') {
          const newBaseInfo = {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phoneNumber: data.phone || '',
            gender: data.gender
              ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1)
              : 'Male',
            birthday: data.date_of_birth || '',
            employmentType: data.employment_type || 'Employee',
            employmentDate: data.start_date || '',
            maritalStatus: data.marital_status || 'Single',
            taxPayerNumber: data.tax_payer_number || '',
            nationalId: data.national_identification_number || '',
            employeeId: data.uuid || '', // Use uuid as employeeId
            jobTitle: data.jobTitle || '',
            roleId: data.role_id || '', // Map role_id from API to roleId in form
          };
          console.log('Setting baseInfo to:', newBaseInfo);
          setBaseInfo(newBaseInfo);
          // Increment key to force re-render of components with new data
          setFormKey((prev) => prev + 1);
        }

        // Rest of the function remains the same...
      }
    } catch (error) {
      console.error('Error fetching person data:', error);
      toast.error('Failed to load employee data');
    } finally {
      setIsFetching(false);
    }
  };

  // Save active step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('potta_activeStep', active);
  }, [active]);

  // Function to collect data from each component
  const handleBaseInfoChange = (data: BaseInfoPayload) => {
    console.log('BaseInfo changed:', data);
    setBaseInfo(data);
    // Save to localStorage
    localStorage.setItem('potta_baseInfo', JSON.stringify(data));
  };

  const handleAddressChange = (data: AddressPayload) => {
    console.log('Address changed:', data);
    setAddress(data);
    // Save to localStorage
    localStorage.setItem('potta_address', JSON.stringify(data));
  };

  const handleBankAccountChange = (data: BankAccountPayload) => {
    setBankAccount(data);
    // Save to localStorage
    localStorage.setItem('potta_bankAccount', JSON.stringify(data));
  };

  const handleCompensationChange = (data: CompensationPayload) => {
    setCompensation(data);
    // Save to localStorage
    localStorage.setItem('potta_compensation', JSON.stringify(data));
  };

  const handleScheduleChange = (data: SchedulePayload) => {
    setSchedule(data);
    // Save to localStorage
    localStorage.setItem('potta_schedule', JSON.stringify(data));
  };

  const handleBenefitChange = (data: BenefitPayload) => {
    setBenefit(data);
    // Save to localStorage
    localStorage.setItem('potta_benefit', JSON.stringify(data));
  };

  const handleTaxInfoChange = (data: TaxInfoPayload) => {
    setTaxInfo(data);
    // Save to localStorage
    localStorage.setItem('potta_taxInfo', JSON.stringify(data));
  };

  // Clear all saved data
  const clearSavedData = () => {
    localStorage.removeItem('potta_personId');
    localStorage.removeItem('potta_baseInfo');
    localStorage.removeItem('potta_address');
    localStorage.removeItem('potta_bankAccount');
    localStorage.removeItem('potta_compensation');
    localStorage.removeItem('potta_schedule');
    localStorage.removeItem('potta_benefit');
    localStorage.removeItem('potta_taxInfo');
    localStorage.removeItem('potta_activeStep');

    // Reset all state
    setPersonId(null);
    setPersonData(null);
    setBaseInfo(null);
    setAddress(null);
    setBankAccount(null);
    setCompensation(null);
    setSchedule(null);
    setBenefit(null);
    setTaxInfo(null);
    setActive('ebi');
  };

  // Format data according to the required payload structure
  const formatPersonPayload = (): PersonPayload | null => {
    if (!baseInfo || !address) {
      return null;
    }

    const payload = {
      firstName: baseInfo.firstName,
      lastName: baseInfo.lastName,
      email: baseInfo.email,
      phone: baseInfo.phoneNumber,
      gender: baseInfo.gender.toLowerCase(),
      date_of_birth: baseInfo.birthday,
      employment_type: baseInfo.employmentType,
      start_date: baseInfo.employmentDate,
      end_date: null,
      hourly_rate: compensation?.hourlyRate || 0,
      salary: compensation?.salary || 0,
      payment_frequency: compensation?.paymentFrequency || 'Monthly',
      marital_status: baseInfo.maritalStatus,
      payScheduleId:
        schedule?.payScheduleId || '798edbfb-58bd-4e81-be68-557001cac80e',
      tax_payer_number: baseInfo.taxPayerNumber,
      national_identification_number: baseInfo.nationalId,
      roleId: baseInfo.roleId, // Use the selected roleId
      isActive: true,
      address: {
        address: address.address,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode,
        latitude: address.latitude || 0,
        longitude: address.longitude || 0,
      },
      // Include additional data if needed for the complete person creation
      benefits: benefit || undefined,
      taxInfo: taxInfo || undefined,
    };

    console.log('Formatted person payload:', payload);
    return payload;
  };

  // Handle proceed button click
  const handleProceed = async () => {
    setIsLoading(true);

    try {
      switch (active) {
        case 'ebi':
          // Validate base info
          if (!baseInfo) {
            toast.error('Please complete the employee base information');
            break;
          }
          // Just move to next step - we'll collect and validate data when needed
          setActive('el');
          break;

        case 'el':
          // Validate address info
          if (!address) {
            toast.error('Please complete the employee location information');
            break;
          }
          // Move to next step without creating person yet
          setActive('ba');
          break;

        case 'ba':
          // Validate bank account info
          if (!bankAccount) {
            toast.error('Please complete the bank account information');
            break;
          }
          // Move to next step
          setActive('c');
          break;

        case 'c':
          // Validate compensation info
          if (!compensation) {
            toast.error('Please complete the compensation information');
            break;
          }
          // Move to next step
          setActive('ps');
          break;

        case 'ps':
          // Validate schedule info
          if (!schedule) {
            toast.error('Please complete the schedule information');
            break;
          }
          // Move to next step
          setActive('bad');
          break;

        case 'bad':
          // Validate benefit info
          if (!benefit) {
            toast.error('Please complete the benefits information');
            break;
          }
          // Move to next step
          setActive('eti');
          break;

        case 'eti':
          // This is where we create the person with all collected information
          if (
            !baseInfo ||
            !address ||
            !bankAccount ||
            !compensation ||
            !schedule ||
            !benefit ||
            !taxInfo
          ) {
            toast.error(
              'Please complete all previous steps before creating the employee'
            );
            break;
          }

          // Format the data according to the required payload structure
          const payload = formatPersonPayload();
          if (!payload) {
            toast.error('Invalid form data');
            break;
          }

          // Create person with formatted payload
          const loadingToastId = toast.loading('Creating employee...');
          try {
            console.log('Sending payload to create person:', payload);
            const result = await peopleApi.createPerson(payload);
            console.log('Person created successfully:', result);
            setPersonId(result.uuid);

            // Save personId to localStorage
            localStorage.setItem('potta_personId', result.uuid);

            // Now create the bank account for the person
            const bankAccountData = {
              ...bankAccount,
              person_id: result.uuid,
            };

            console.log('Creating bank account with data:', bankAccountData);
            await peopleApi.createBankAccount(bankAccountData);

            toast.success('Employee created successfully!');
            toast.success('Bank account created successfully!');
            toast.success('Employee setup completed!');

            // Clear all data from localStorage when complete
            clearSavedData();

            // Optionally redirect to employee list or dashboard
            // window.location.href = '/payroll/people/list';
          } catch (error) {
            console.error('Error creating person:', error);
            toast.error('Failed to create employee. Please try again.');
          } finally {
            toast.dismiss(loadingToastId);
          }
          break;
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab click with data fetching
  const handleTabClick = (tab: string) => {
    // Always allow navigation between steps in this new flow
    // since we're not creating the user until the final step
    setActive(tab);
  };

  return (
    <RootLayout>
      <div className="w-full flex px-14 overflow-hidden max-h-[calc(100vh-65px)] ">
        <div className="w-[16%] pt-10 item-left space-y-7 border-r overflow-hidden">
          <div className="" onClick={() => handleTabClick('ebi')}>
            <p
              className={`whitespace-nowrap ${
                active == 'ebi' && 'text-green-700 font-semibold'
              } cursor-pointer text-left`}
            >
              Employee Base Information
            </p>
          </div>
          <div className="" onClick={() => handleTabClick('el')}>
            <p
              className={`whitespace-nowrap ${
                active == 'el' && 'text-green-700 font-semibold'
              } cursor-pointer text-left`}
            >
              Employee Location
            </p>
          </div>
          <div className="" onClick={() => handleTabClick('ba')}>
            <p
              className={`whitespace-nowrap ${
                active == 'ba' && 'text-green-700 font-semibold'
              } cursor-pointer text-left`}
            >
              Bank Account
            </p>
          </div>
          <div className="" onClick={() => handleTabClick('c')}>
            <p
              className={`whitespace-nowrap ${
                active == 'c' && 'text-green-700 font-semibold'
              } cursor-pointer text-left`}
            >
              Compensation
            </p>
          </div>
          <div className="" onClick={() => handleTabClick('ps')}>
            <p
              className={`whitespace-nowrap ${
                active == 'ps' && 'text-green-700 font-semibold'
              } cursor-pointer text-left`}
            >
              Payroll Schedule{' '}
            </p>
          </div>
          <div className="" onClick={() => handleTabClick('bad')}>
            <p
              className={`whitespace-nowrap ${
                active == 'bad' && 'text-green-700 font-semibold'
              } cursor-pointer text-left`}
            >
              Benefit and Deduction
            </p>
          </div>
        </div>
        <div className="w-[82%] h-[calc(100vh-65px)] overflow-y-auto pt-0 px-10 relative ">
          {isFetching && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
                <p className="mt-2 text-green-600">Loading employee data...</p>
              </div>
            </div>
          )}

          {personId && (
            <div className="bg-green-50 p-3 mb-4 rounded-md border border-green-200">
              <p className="text-green-800 font-medium">
                Employee ID: {personId}
              </p>
              {personData && (
                <p className="text-green-700">
                  {personData.firstName} {personData.lastName}
                </p>
              )}
            </div>
          )}

          <div>
            {active === 'ebi' && (
              <BaseInfo
                key={`baseInfo-${formKey}`}
                onChange={handleBaseInfoChange}
                initialData={baseInfo}
              />
            )}
            {active === 'el' && (
              <Address
                key={`address-${formKey}`}
                onChange={handleAddressChange}
                initialData={address}
              />
            )}
            {active === 'ba' && (
              <BankAccount
                key={`bankAccount-${formKey}`}
                personId={personId || 'temp-id'} // Use a temporary ID if not created yet
                onChange={handleBankAccountChange}
                initialData={bankAccount}
              />
            )}
            {active === 'c' && (
              <Compensation
                key={`compensation-${formKey}`}
                onChange={handleCompensationChange}
                initialData={compensation}
              />
            )}
            {active === 'ps' && (
              <Schedule
                key={`schedule-${formKey}`}
                onChange={handleScheduleChange}
                initialData={schedule}
              />
            )}
            {active === 'bad' && (
              <Benefit
                key={`benefit-${formKey}`}
                onChange={handleBenefitChange}
                initialData={benefit}
              />
            )}
          </div>
          <div className="w-full p-2 flex justify-between mt-5 px-14">
            {/* Add a Reset button to clear all data */}
            <Button
              text="Reset Form"
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to reset the form? All data will be lost.'
                  )
                ) {
                  clearSavedData();
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            />

            <Button
              text={
                isLoading
                  ? 'Processing...'
                  : active === 'eti'
                  ? 'Create Employee'
                  : 'Proceed'
              }
              type={'submit'}
              onClick={handleProceed}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default People;
