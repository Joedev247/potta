'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Switch } from '@headlessui/react';
import Input from '@potta/components/input';
import { PhoneInput } from '@potta/components/phoneInput';
import Select from '@potta/components/select';
import SearchableSelect from '@potta/components/searchableSelect';
import { CalendarDate } from '@internationalized/date';
import CustomDatePicker from '@potta/components/customDatePicker';
import axios from 'config/axios.config';

// Define enum for marital status
enum MaritalStatusEnum {
  SINGLE = 'Single',
  MARRIED = 'Married',
  DIVORCED = 'Divorced',
  WIDOWED = 'Widowed',
  SEPARATED = 'Separated',
  DOMESTIC_PARTNER = 'Domestic Partner',
  CIVIL_UNION = 'Civil Union',
  ENGAGED = 'Engaged',
  COMPLICATED = 'Complicated',
  OTHER = 'Other',
}

interface BaseInfoProps {
  onChange?: (data: any) => void;
  initialData?: any;
}

// Define the PhoneMetadata interface to match what the PhoneInput component provides
interface PhoneMetadata {
  formattedValue: string;
  countryCode: string;
  rawInput: string;
}

// Define Role interface
interface Role {
  uuid: string;
  name: string;
  description?: string;
  is_active?: boolean;
}

const BaseInfo: React.FC<BaseInfoProps> = ({ onChange, initialData }) => {
  // Use a ref to track if we've initialized with initial data
  const initializedRef = useRef(false);

  // Initialize with default values to avoid uncontrolled to controlled warnings
  const [formData, setFormData] = useState({
    employmentType: 'Employee',
    jobTitle: '',
    roleId: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    birthday: '',
    maritalStatus: MaritalStatusEnum.SINGLE,
    gender: 'Male',
    nationalId: '',
    taxPayerNumber: '',
    employeeId: '',
    employmentDate: '',
  });

  // State for roles
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleOptions, setRoleOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  // Track phone metadata separately to maintain all parts of the phone number
  const [phoneMetadata, setPhoneMetadata] = useState<PhoneMetadata>({
    formattedValue: '',
    countryCode: '+237', // Default to Cameroon
    rawInput: '',
  });

  // Use a ref to prevent the onChange callback from causing re-renders
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoadingRoles(true);
      try {
        const response = await axios.post(
          '/api/potta/roles/filter',
          {},
          {
            params: {
              limit: 100,
              sortBy: 'name:ASC',
            },
          }
        );

        if (response.data && response.data.data) {
          setRoles(response.data.data);

          // Create options for the select component
          const options = response.data.data.map((role: Role) => ({
            label: role.name,
            value: role.uuid,
          }));

          setRoleOptions(options);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);
  // Add this inside the useEffect that handles initialData
  useEffect(() => {
    if (initialData && !initializedRef.current) {
      console.log('BaseInfo received initialData:', initialData);
      console.log('Role ID from initialData:', initialData.roleId); // Add this line

      // Create a new object with default values for any missing fields
      const newFormData = {
        employmentType: initialData.employmentType || 'Employee',
        jobTitle: initialData.jobTitle || '',
        roleId: initialData.roleId || '',
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        phoneNumber: initialData.phoneNumber || '',
        email: initialData.email || '',
        birthday: initialData.birthday || '',
        maritalStatus: initialData.maritalStatus || MaritalStatusEnum.SINGLE,
        gender: initialData.gender || 'Male',
        nationalId: initialData.nationalId || '',
        taxPayerNumber: initialData.taxPayerNumber || '',
        employeeId: initialData.employeeId || '',
        employmentDate: initialData.employmentDate || '',
      };

      setFormData(newFormData);

      // Update phone metadata if phone number is available
      if (initialData.phoneNumber) {
        setPhoneMetadata({
          formattedValue: initialData.phoneNumber,
          countryCode: initialData.phoneNumber.substring(0, 4) || '+237',
          rawInput: initialData.phoneNumber,
        });
      }

      initializedRef.current = true;
    }
  }, [initialData]);
  // Direct input change handler for the Input component
  const handleInputChange = useCallback(
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        // Call onChange outside of setState to prevent re-renders
        setTimeout(() => {
          if (onChangeRef.current) onChangeRef.current(updated);
        }, 0);
        return updated;
      });
    },
    []
  );

  // Handle phone input change - updated to match the SliderCustomer implementation
  const handlePhoneChange = useCallback(
    (combinedValue: string, metadata: PhoneMetadata) => {
      // Store the complete metadata for future reference
      setPhoneMetadata(metadata);

      // Update the form data with the combined value
      setFormData((prev) => {
        const updated = { ...prev, phoneNumber: combinedValue };
        // Call onChange outside of setState to prevent re-renders
        setTimeout(() => {
          if (onChangeRef.current) onChangeRef.current(updated);
        }, 0);
        return updated;
      });
    },
    []
  );

  // Handle select change
  const handleSelectChange = useCallback(
    (name: string, value: string) => {
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };

        // If changing the role, update the jobTitle field as well
        if (name === 'roleId') {
          const selectedRole = roles.find((role) => role.uuid === value);
          if (selectedRole) {
            updated.jobTitle = selectedRole.name;
          }
        }

        // Call onChange outside of setState to prevent re-renders
        setTimeout(() => {
          if (onChangeRef.current) onChangeRef.current(updated);
        }, 0);
        return updated;
      });
    },
    [roles]
  );

  // Handle date change for birthday
  const handleBirthdayChange = useCallback((value: CalendarDate | null) => {
    if (value) {
      // Format date as YYYY-MM-DD
      const formattedDate = `${value.year}-${String(value.month).padStart(
        2,
        '0'
      )}-${String(value.day).padStart(2, '0')}`;

      setFormData((prev) => {
        const updated = { ...prev, birthday: formattedDate };
        // Call onChange outside of setState to prevent re-renders
        setTimeout(() => {
          if (onChangeRef.current) onChangeRef.current(updated);
        }, 0);
        return updated;
      });
    }
  }, []);

  // Handle date change for employment date
  const handleEmploymentDateChange = useCallback(
    (value: CalendarDate | null) => {
      if (value) {
        // Format date as YYYY-MM-DD
        const formattedDate = `${value.year}-${String(value.month).padStart(
          2,
          '0'
        )}-${String(value.day).padStart(2, '0')}`;

        setFormData((prev) => {
          const updated = { ...prev, employmentDate: formattedDate };
          // Call onChange outside of setState to prevent re-renders
          setTimeout(() => {
            if (onChangeRef.current) onChangeRef.current(updated);
          }, 0);
          return updated;
        });
      }
    },
    []
  );

  // Create marital status options from enum
  const maritalStatusOptions = Object.values(MaritalStatusEnum).map(
    (status) => ({
      label: status,
      value: status,
    })
  );

  // Create gender options
  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
    { label: 'Prefer not to say', value: 'Prefer not to say' },
  ];

  // Parse string dates to CalendarDate objects for the DatePicker
  const getBirthdayDate = useCallback(() => {
    try {
      if (formData.birthday) {
        const [year, month, day] = formData.birthday.split('-').map(Number);
        return new CalendarDate(year, month, day);
      }
      return null;
    } catch (error) {
      console.error('Invalid birthday date format:', error);
      return null;
    }
  }, [formData.birthday]);

  const getEmploymentDate = useCallback(() => {
    try {
      if (formData.employmentDate) {
        const [year, month, day] = formData.employmentDate
          .split('-')
          .map(Number);
        return new CalendarDate(year, month, day);
      }
      return null;
    } catch (error) {
      console.error('Invalid employment date format:', error);
      return null;
    }
  }, [formData.employmentDate]);

  return (
    <div className="w-full flex flex-col gap-4 pt-10 px-14 ">
      <div>
        <SearchableSelect
          options={[
            { label: 'Contractor', value: 'Contractor' },
            { label: 'Employee', value: 'Employee' },
          ]}
          label="Employement Type"
          labelClass="pb-2 !font-bold"
          selectedValue={formData.employmentType}
          onChange={(value: string) =>
            handleSelectChange('employmentType', value)
          }
         
        />
      </div>
      <div className="">
        <SearchableSelect
          label="Job Title / Role"
          labelClass="!font-bold"
          options={roleOptions}
          selectedValue={formData.roleId}
          onChange={(value) => handleSelectChange('roleId', value)}
          placeholder={isLoadingRoles ? 'Loading roles...' : 'Select a role'}
          isDisabled={isLoadingRoles}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="text"
          placeholder="fname"
          name="firstName"
          labelClass="!font-bold"
          label="First Name"
          value={formData.firstName}
          onchange={handleInputChange('firstName')}
        />
        <Input
          type="text"
          name="lastName"
          placeholder="lname"
          labelClass="!font-bold"
          label="Last Name"
          value={formData.lastName}
          onchange={handleInputChange('lastName')}
        />
      </div>
      <div>
        <div className="grid grid-cols-2 gap-3">
          <PhoneInput
            label="Telephone Number"
            placeholder="Enter phone number"
            value={phoneMetadata.formattedValue} // Use the formatted value from metadata
            onChange={handlePhoneChange}
            whatsapp={false}
            countryCode={phoneMetadata.countryCode} // Use the country code from metadata
          />

          <div>
            <Input
              type="text"
              name="email"
              labelClass="!font-bold"
              label="Email Address"
              placeholder="youemail@gmail.com"
              value={formData.email}
              onchange={handleInputChange('email')}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 items-center">
        <CustomDatePicker
          label="Birth date"
          placeholder="Select birth date"
          value={getBirthdayDate()}
          onChange={handleBirthdayChange}
          isRequired
        />
        <div>
          <SearchableSelect
            
            options={maritalStatusOptions}
            label="Marital Status"
            labelClass="pb-2 !font-bold"
            selectedValue={formData.maritalStatus}
            onChange={(value: string) =>
              handleSelectChange('maritalStatus', value)
            }
          
          />
        </div>
      </div>
      <div className="w-1/2">
        <SearchableSelect
          options={genderOptions}
          label="Gender"
          labelClass="pb-2 !font-bold"
          selectedValue={formData.gender}
          onChange={(value: string) => handleSelectChange('gender', value)}
          
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="text"
          name="nationalId"
          labelClass="!font-bold"
          label="National Identification Number"
          value={formData.nationalId}
          onchange={handleInputChange('nationalId')}
        />
        <Input
          type="text"
          name="taxPayerNumber"
          labelClass="!font-bold"
          label="Tax payers number"
          value={formData.taxPayerNumber}
          onchange={handleInputChange('taxPayerNumber')}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="text"
          name="employeeId"
          labelClass="!font-bold"
          label="Employee ID"
          value={formData.employeeId}
          onchange={handleInputChange('employeeId')}
        />
        <div className="mt-5">
          <CustomDatePicker
            label="Employment Date"
            placeholder="Select employment date"
            value={getEmploymentDate()}
            onChange={handleEmploymentDateChange}
          />
        </div>
      </div>
    </div>
  );
};
export default BaseInfo;
