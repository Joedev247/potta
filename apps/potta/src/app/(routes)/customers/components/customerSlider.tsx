'use client';
import React, { useContext, useState } from 'react';
import Input from '@potta/components/input';

import Slider from '@potta/components/slideover';
import { SingleValue } from 'react-select';
import Select from '@potta/components/select';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@potta/components/button';
import Address from './address';
import { ContextData } from '@potta/components/context';
import { CustomerPayload, customerSchema } from '../utils/validations';
import Notes from './note';
import Tax from './tax';
import useCreateCustomer from '../hooks/useCreateCustomer';
import toast from 'react-hot-toast';

const SliderCustomer = () => {
  const [tabs, setTabs] = useState<string>('Address');
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const context = useContext(ContextData);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CustomerPayload>({
    resolver: yupResolver(customerSchema),
    defaultValues: {
      firstName: '',
      lastName:'',
      type: undefined,
      contactPerson: '',
      email: '',
      phone: '',
      address: {
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        latitude: 0,
        longitude: 0,
      },
      taxID: '',
      creditLimit:'',
      gender: undefined
    },
  });

  const CustomerTypeEnum = [
    { value: 'individual', label: 'Individual' },
    { value: 'company', label: 'Company' },
  ];

  const CustomerGenderEnum = [
    { value:'male', label: 'Male' },
    { value:'female', label: 'Female' },
    { value:'other', label: 'Other' },
  ];

  const mutation = useCreateCustomer();
  const onSubmit = (data: CustomerPayload) => {
    console.log('Submitted Data:', data);
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success('Customer created successfully!');
        reset();
        setIsSliderOpen(false);
      },
      onError: (error) => {
        toast.error('Failed to create Customer');
      },
    });
  };
  return (
    <Slider
      open={isSliderOpen}
      setOpen={setIsSliderOpen}
      edit={false}
      title={'Create Customer'}
      buttonText="customer"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative h-[97%] w-full max-w-4xl"
      >
        <div className="w-full grid grid-cols-2 gap-3">
          <div>
            <Input
              label="First Name"
              type="text"
              name="firstName"
              placeholder="Enter customer First Name"
              register={register}
              errors={errors.firstName}
            />
          </div>
          <div>
            <Input
              label="Last Name"
              type="text"
              name="lastName"
              placeholder="Enter customer Last Name"
              register={register}
              errors={errors.lastName}
            />
          </div>
        </div>
        <div className="w-full grid my-5 grid-cols-2 gap-3">
          <div>
            <Input
              label="Contact Name"
              type="text"
              name="contactPerson"
              placeholder="Enter Contact Name"
              register={register}
              errors={errors.contactPerson}
            />
          </div>
          <div>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  options={CustomerTypeEnum}
                  selectedValue={field.value}
                  onChange={field.onChange}
                  bg="bg-white"
                  name="Select Customer Type"
                  label="Type"
                />
              )}
            />
            {errors.type && (
              <small className="text-red-500">{errors.type.message}</small>
            )}
          </div>
        </div>
        <div className="w-full grid my-5 grid-cols-2 gap-3">
          <div>
            <Input
              label="Credit Limit"
              type="number"
              name="creditLimit"
              placeholder="Enter Credit limit"
              register={register}
              errors={errors.creditLimit}
            />
          </div>
          <div>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  options={CustomerGenderEnum}
                  selectedValue={field.value}
                  onChange={field.onChange}
                  bg="bg-white"
                  name="Select Customer Gender"
                  label="Gender"
                />
              )}
            />
            {errors.type && (
              <small className="text-red-500">{errors.type.message}</small>
            )}
          </div>
        </div>
        <hr />
        <div className="mt-2">
          <h1 className="text-xl">Contact Information </h1>
          <div className="w-full grid mt-7 grid-cols-2 gap-3">
            <div>
              <Input
                type="tel"
                label={'Phone Number'}
                name={'phone'}
                placeholder="(555) 123-4567"
                register={register}
                errors={errors.phone}
              />
            </div>
            <div>
              <Input
                type={'text'}
                label={'Email'}
                name={'email'}
                placeholder="abcdfg@abc.com"
                register={register}
                errors={errors.email}
              />
            </div>
          </div>


        </div>
        <div className="mt-5">
          <div className="flex w-fit bg-green-100  mt-7">
            <div
              onClick={() => setTabs('Address')}
              className={`px-4 py-2.5 duration-500 ease-in-out ${
                tabs == 'Address' &&
                'border-b  border-green-500 text-green-500 font-thin '
              } cursor-pointer `}
            >
              <p>Address</p>
            </div>

            <div
              onClick={() => setTabs('Tax')}
              className={`px-4 py-2.5 duration-500 ease-in-out ${
                tabs == 'Tax' &&
                'border-b border-green-500 text-green-500 font-thin '
              } cursor-pointer `}
            >
              <p>Tax ID</p>
            </div>
          </div>
          <div className="mt-5 pb-20 duration-500 ease-in-out">
            {tabs == 'Address' && (
              <Address register={register} errors={errors?.address ?? {}} />
            )}
            {tabs == 'Tax' && <Tax register={register} errors={errors.taxID} />}
          </div>
        </div>
        <div className="flex-grow" /> {/* This div takes up remaining space */}
        <div className="text-center md:text-right md:flex md:justify-end space-x-4 fixed bottom-0 left-0 right-0 bg-white p-4">
          <Button
            isLoading={mutation.isPending}
            text={'Save Vendor'}
            type={'submit'}
          />
        </div>
      </form>
    </Slider>
  );
};

export default SliderCustomer;
