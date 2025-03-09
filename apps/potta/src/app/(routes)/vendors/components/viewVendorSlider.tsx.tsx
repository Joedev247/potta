'use client';
import React, { useContext, useEffect, useState } from 'react';
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
import Text from '@potta/components/textDisplay';
import useGetOneVendor from '../hooks/useGetOneVendor';
import { PhoneFlag } from './table';
interface VendorDetailsProps {
  vendorId: string;
<<<<<<< HEAD
}
const ViewVendorSlider: React.FC<VendorDetailsProps> = ({ vendorId }) => {
  const context = useContext(ContextData);
  const { data, isLoading, error, refetch } = useGetOneVendor(vendorId);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && vendorId) {
      refetch();
    }
  }, [open, vendorId, refetch]);
  return (
    <Slider
      onOpen={() => setOpen(true)}
=======
  open?: boolean; // Optional controlled open state
  setOpen?: (open: boolean) => void; // Optional setter from parent
}
const ViewVendorSlider: React.FC<VendorDetailsProps> = ({
  vendorId,
  open: controlledOpen, // Renamed to avoid naming conflict
  setOpen: setControlledOpen,
}) => {
  const context = useContext(ContextData);
  const { data, isLoading, error, refetch } = useGetOneVendor(vendorId);

  // Local state as fallback if no controlled state is provided
  const [localOpen, setLocalOpen] = useState(false);

  // Determine which open state to use
  const isOpen = controlledOpen ?? localOpen;
  const setIsOpen = setControlledOpen ?? setLocalOpen;

  useEffect(() => {
    if (isOpen && vendorId) {
      refetch();
    }
  }, [vendorId, refetch, isOpen]);
  return (
    <Slider
      open={isOpen} // Use controlled or local state
      setOpen={setIsOpen} // Use controlled or local setter
>>>>>>> d703d00 ( inventory and vendor ui fixes customer)
      edit={false}
      title={'Vendor Details'}
      buttonText="view vendor"
    >
      {isLoading && (
<<<<<<< HEAD
        <div className="flex justify-center items-center py-10">Loading</div>
=======
        <div className="flex justify-center items-center py-10 h-screen">
          Loading
        </div>
>>>>>>> d703d00 ( inventory and vendor ui fixes customer)
      )}

      {error && (
        <p className="text-red-600 text-center">
          Error fetching vendor details: {error.message}
        </p>
      )}

      {!data ||
        (Object.keys(data).length === 0 && (
          <p className="text-gray-500 text-center">No vendor data available.</p>
        ))}

      {data && (
<<<<<<< HEAD
        <div className="max-w-4xl mx-auto p-6 ">
=======
        <div className="relative h-screen w-full max-w-4xl">
>>>>>>> d703d00 ( inventory and vendor ui fixes customer)
          {/* Header */}
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Name" value={data.name} height />
            <Text name="Type" value={data.type} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Email" value={data.email} height />
            <div className="">
              <span className="mb-3 text-gray-900 font-bold">Phone Number</span>
              <div className={`w-full py-1.5' px-4 mt-2`}>
                {data.phone && <PhoneFlag phoneNumber={`${data.phone}`} />}
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Contact Person" value={data.contactPerson} height />
            <Text name="Website" value={data.website} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Status" value={data.status} height />
            <Text name="Classification" value={data.classification} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Payment Terms" value={data.paymentTerms} height />

            <Text name="Payment Method" value={data.paymentMethod} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Tax ID" value={data.taxId} height />
            <Text name="Account Details" value={data.accountDetails} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Opening Balance" value={data.openingBalance} height />
            <Text name="Currency" value={data.currency} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Notes" value={data.notes} height />
            <Text name="Created At" value={data.createdAt} height />
          </div>
          <hr />
          <h1 className="text-2xl my-2">Address</h1>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Address" value={data.address.address} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="City" value={data.address.city} height />
            <Text name="Postal Code" value={data.address.postalCode} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="State" value={data.address.state} height />
            <Text name="Country" value={data.address.country} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Latitude" value={data.address.latitude} height />
            <Text name="Longitude" value={data.address.longitude} height />
          </div>
<<<<<<< HEAD
=======

          {/* <div className="text-center md:text-right mt-4 md:flex md:justify-end space-x-4">
            <Button
              text="Cancel"
              type="button"
              theme="gray"
              color={true}
              onClick={() => setIsSliderOpen(false)}
            />
          </div> */}
>>>>>>> d703d00 ( inventory and vendor ui fixes customer)
        </div>
      )}
    </Slider>
  );
};

export default ViewVendorSlider;
