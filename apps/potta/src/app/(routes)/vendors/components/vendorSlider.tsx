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
import { VendorPayload, vendorSchema } from '../utils/validations';
import Notes from './note';
import Tax from './tax';
import useCreateVendor from '../hooks/useCreateVendor';
import toast from 'react-hot-toast';




const SliderVendor = () => {
  const [tabs, setTabs] = useState<string>('Address');
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const context = useContext(ContextData);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }, reset
  } = useForm<VendorPayload>({
    resolver: yupResolver(vendorSchema),
    defaultValues: {
      name: '',
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
      paymentTerms: '',
      paymentMethod: '',
      website: '',
      accountDetails: '',
      currency: undefined,
      openingBalance: 0,
      classification: undefined,
      notes: '',
    },
  });

  const VendorTypeEnum = [
    { value: 'individual', label: 'Individual' },
    { value: 'company', label: 'Company' },
  ];

  const VendorClassificationEnum = [
    { value: 'Supplier', label: 'Supplier' },
    { value: 'Service Provider', label: 'Service Provider' },
  ];

  const VendorCurrencyEnum = [
    { value: 'EUR', label: 'EUR' },
    { value: 'USD', label: 'USD' },
    { value: 'XAF', label: 'XAF' },
  ];
  const mutation = useCreateVendor();
  const onSubmit = (data: VendorPayload) => {
    console.log('Submitted Data:', data);
    mutation.mutate(data,{
      onSuccess: () => {
        toast.success('Vendor created successfully!');
        reset();
        setIsSliderOpen(false)
      },
      onError: (error) => {
        toast.error('Failed to create vendor');
      },
    });
  };
  return (
    <Slider open={isSliderOpen}
    setOpen={setIsSliderOpen} edit={false} title={'Create New Vendor'} buttonText="vendor">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative h-screen w-full max-w-4xl"
      >
        <div className="w-full grid grid-cols-2 gap-3">
          <div>
            <Input
              label="Vendor Name"
              type="text"
              name="name"
              placeholder="Enter vendor name"
              register={register}
              errors={errors.name}
              required
            />
          </div>
          <div>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  options={VendorTypeEnum}
                  selectedValue={field.value}
                  onChange={field.onChange}
                  bg="bg-white"
                  name="Select Vendor Type"
                  label="Type"
                  required
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
              name="classification"
              control={control}
              render={({ field }) => (
                <Select
                  options={VendorClassificationEnum}
                  selectedValue={field.value}
                  onChange={field.onChange}
                  bg="bg-white"
                  name="Select Classification"
                  label="Classification "
                  required
                />
              )}
            />
            {errors.classification && (
              <small className="text-red-500">
                {errors.classification.message}
              </small>
            )}
          </div>
        </div>
        <hr />
        <div className="mt-2">
          <h1 className="text-xl">Contact Information </h1>
          <div className="w-full grid mt-7 grid-cols-2 gap-3">
            <div>
              <Input
              type='tel'
                label={'Phone Number'}
                name={'phone'}
                placeholder="(555) 123-4567"
                register={register}
                errors={errors.phone}
                required
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
                required
              />
            </div>
          </div>

          <div className="w-full grid mt-4 grid-cols-1 space-y-4">
            <div>
              <Input
                type={'text'}
                label={'Website'}
                name={'website'}
                placeholder="www.example.com"
                register={register}
                errors={errors.website}
              />
            </div>
          </div>
          <div className="w-full grid mt-4 grid-cols-2 gap-3">
            <div>
              <Input
                type={'number'}
                label={'Opening Balance '}
                placeholder="00"
                name={'openingBalance'}
                register={register}
                errors={errors.openingBalance}
              />
            </div>
            <div>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select
                    options={VendorCurrencyEnum}
                    selectedValue={field.value}
                    onChange={field.onChange}
                    bg="bg-white"
                    name="Select Currency"
                    label="Currency "
                    required
                  />
                )}
              />
              {errors.currency && (
                <small className="text-red-500">
                  {errors.currency.message}
                </small>
              )}
            </div>
          </div>
          <div className="w-full grid mt-4 grid-cols-1 space-y-4">
            <Input
              label="Account Details"
              type="text"
              name="accountDetails"
              placeholder="Enter account Details"
              register={register}
              errors={errors?.accountDetails}
            />
          </div>
          <div className="w-full grid mt-4 grid-cols-2 gap-3">
            <Input
              label="Payment Terms"
              type="text"
              name="paymentTerms"
              placeholder="Enter your payment terms"
              register={register}
              errors={errors?.paymentTerms}
            />
            <Input
              label="Payment Method"
              type="text"
              name="paymentMethod"
              placeholder="Enter your payment Methos"
              register={register}
              errors={errors?.paymentMethod}
            />
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
              onClick={() => setTabs('Notes')}
              className={`px-4 py-2.5 duration-500 ease-in-out ${
                tabs == 'Notes' &&
                'border-b border-green-500 text-green-500 font-thin '
              } cursor-pointer `}
            >
              <p>Notes</p>
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
            {tabs == 'Notes' && (
              <Notes register={register} errors={errors.notes} />
            )}
            {tabs == 'Tax' && <Tax register={register} errors={errors.taxID} />}
          </div>
        </div>
        <div className="flex-grow" /> {/* This div takes up remaining space */}
        <div className="text-center md:text-right  md:flex  space-x-4 fixed bottom-0 left-0 right-0 justify-center bg-white p-4">
        <div className="flex gap-2 w-full max-w-4xl justify-between">
          <Button
              text="Cancel"
              type="button"
              theme="danger"

              onClick={() => setIsSliderOpen(false)}
            />
          <Button
            isLoading={mutation.isPending}
            text={'Save Vendor'}
            type={'submit'}
          />
        </div>
        </div>
      </form>
    </Slider>
  );
};

export default SliderVendor;
