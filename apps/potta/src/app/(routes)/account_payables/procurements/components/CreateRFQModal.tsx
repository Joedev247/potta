'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Slider from '@potta/components/slideover';
import Input from '@potta/components/input';
import Button from '@potta/components/button';
import SearchableSelect from '@potta/components/searchableSelect';
import { DateInput } from '@potta/components/customDatePicker';
import { Skeleton } from '@potta/components/shadcn/skeleton';
import { useCreateRFQ, useGetSpendRequest } from '../hooks/useProcurement';
import useGetAllVendors from '../../../vendors/hooks/useGetAllVendors';

interface CreateRFQModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  spendRequestId: string | null;
  onCreated?: () => void;
}

const CreateRFQModal: React.FC<CreateRFQModalProps> = ({
  open,
  setOpen,
  spendRequestId,
  onCreated,
}) => {
  const createRFQMutation = useCreateRFQ();

  // Fetch spend request details by ID
  const {
    data: spendRequest,
    isLoading: loadingSpendRequest,
    refetch: refetchSpendRequest,
  } = useGetSpendRequest(spendRequestId || '');

  // Refetch when modal opens
  useEffect(() => {
    if (open && spendRequestId) {
      refetchSpendRequest();
    }
  }, [open, spendRequestId, refetchSpendRequest]);

  // Fetch vendors for selection
  const { data: vendorsData, isLoading: loadingVendors } = useGetAllVendors({
    page: 1,
    limit: 100,
  });

  const vendors = vendorsData?.data || [];

  const vendorOptions = useMemo(() => {
    return vendors.map((vendor: any) => ({
      value: vendor.uuid || vendor.id,
      label: vendor.name,
    }));
  }, [vendors]);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30 days');
  const [warranty, setWarranty] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  // Update form when spend request data is loaded
  useEffect(() => {
    if (spendRequest) {
      setTitle(spendRequest.title || '');
      setDescription(spendRequest.description || '');
    }
  }, [spendRequest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!spendRequestId) {
      alert('Invalid spend request');
      return;
    }

    const rfqData = {
      title,
      description,
      deadline: deadline ? deadline.toISOString() : new Date().toISOString(),
      requirements: {
        items:
          spendRequest?.items?.map((item: any) => ({

            description: item.description,
            quantity: Number(item.quantity).toFixed(0) as any,
            unit: 'pieces',
            specifications: item.specifications || '',
            category: item.category,
            unitPrice: item.unitPrice ? Number(item.unitPrice) : undefined,
            totalPrice: item.totalAmount ? Number(item.totalAmount) : undefined,
          })) || [],
        deliveryDate: deliveryDate
          ? deliveryDate.toISOString()
          : new Date().toISOString(),
        deliveryLocation,
        paymentTerms,
        warranty,
      },
      terms: {
        paymentTerms,
        warrantyTerms: warranty,
      },
      instructions,
      vendorIds: selectedVendors,
    };

    try {
      await createRFQMutation.mutateAsync({
        spendRequestId: spendRequestId,
        data: rfqData,
      });

      setOpen(false);
      onCreated?.();

      // Reset form
      setTitle('');
      setDescription('');
      setDeadline(undefined);
      setDeliveryDate(undefined);
      setDeliveryLocation('');
      setPaymentTerms('Net 30 days');
      setWarranty('');
      setInstructions('');
      setSelectedVendors([]);
    } catch (error) {
      console.error('Error creating RFQ:', error);
    }
  };

  if (loadingSpendRequest) {
    return (
      <Slider
        open={open}
        setOpen={setOpen}
        title="Create Request for Quotation (RFQ)"
        edit={false}
        closeButton={false}
      >
        <div className="w-full max-w-4xl space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </Slider>
    );
  }

  return (
    <Slider
      open={open}
      setOpen={setOpen}
      title="Create Request for Quotation (RFQ)"
      edit={false}
      closeButton={false}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <Input
            label="RFQ Title"
            type="text"
            name="title"
            placeholder="e.g., Office Furniture RFQ"
            value={title}
            onchange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
              placeholder="Describe the RFQ purpose"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DateInput
              label="Deadline"
              value={deadline}
              onChange={setDeadline}
              placeholder="Select deadline"
              required
              name="deadline"
            />

            <DateInput
              label="Delivery Date"
              value={deliveryDate}
              onChange={setDeliveryDate}
              placeholder="Select delivery date"
              required
              name="deliveryDate"
            />
          </div>

          <Input
            label="Delivery Location"
            type="text"
            name="deliveryLocation"
            placeholder="e.g., 123 Main St, City, Country"
            value={deliveryLocation}
            onchange={(e) => setDeliveryLocation(e.target.value)}
            required
          />
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Terms & Conditions
          </h3>

          <Input
            label="Payment Terms"
            type="text"
            name="paymentTerms"
            placeholder="e.g., Net 30 days"
            value={paymentTerms}
            onchange={(e) => setPaymentTerms(e.target.value)}
            required
          />

          <Input
            label="Warranty Terms (Optional)"
            type="text"
            name="warranty"
            placeholder="e.g., 2 years manufacturer warranty"
            value={warranty}
            onchange={(e) => setWarranty(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Instructions (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
              placeholder="Any specific instructions for vendors"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
        </div>

        {/* Vendor Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Select Vendors
          </h3>

          <SearchableSelect
            label="Vendors to Invite"
            options={vendorOptions}
            selectedValue={selectedVendors}
            onChange={setSelectedVendors}
            placeholder="Search and select vendors..."
            isDisabled={loadingVendors}
            multiple
            required
          />

          {selectedVendors.length > 0 && (
            <p className="text-sm text-gray-600">
              {selectedVendors.length} vendor
              {selectedVendors.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Items Preview */}
        {spendRequest?.items && spendRequest.items.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Items from Spend Request
            </h3>
            <div className="bg-gray-50 p-4 lg space-y-2">
              {spendRequest.items.map((item: any, index: number) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {index + 1}. {item.description} (x
                    {Number(item.quantity).toFixed(0)})
                  </span>
                  <span className="text-gray-900 font-medium">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 p-2 bg-white border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 md hover:bg-gray-50"
            disabled={createRFQMutation.isPending}
          >
            Cancel
          </button>
          <Button
            text={createRFQMutation.isPending ? 'Creating...' : 'Create RFQ'}
            type="submit"
            disabled={
              createRFQMutation.isPending || selectedVendors.length === 0
            }
          />
        </div>
      </form>
    </Slider>
  );
};

export default CreateRFQModal;
