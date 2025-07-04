'use client';
import React, { useContext, useEffect, useState } from 'react';
import Input from '@potta/components/input';

import Slider from '@potta/components/slideover';
import { SingleValue } from 'react-select';
import Select from '@potta/components/select';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@potta/components/button';

import { ContextData } from '@potta/components/context';

import toast from 'react-hot-toast';
import Text from '@potta/components/textDisplay';

import useGetOneProduct from '../../../_hooks/useGetOneProduct';
import MyDropzone from '@potta/components/dropzone';
import { documentsApi } from '../../../_utils/api';

interface ProductDetailsProps {
  productId: string;
  open?: boolean; // Optional controlled open state
  setOpen?: (open: boolean) => void; // Optional setter from parent
}
const ViewProductSlider: React.FC<ProductDetailsProps> = ({
  productId,
  open: controlledOpen, // Renamed to avoid naming conflict
  setOpen: setControlledOpen,
}) => {
  const context = useContext(ContextData);
  const { data, isLoading, error, refetch } = useGetOneProduct(productId);

  // Local state as fallback if no controlled state is provided
  const [localOpen, setLocalOpen] = useState(false);

  // State for signed image URLs
  const [signedImageUrls, setSignedImageUrls] = useState<string[]>([]);

  // Determine which open state to use
  const isOpen = controlledOpen ?? localOpen;
  const setIsOpen = setControlledOpen ?? setLocalOpen;

  useEffect(() => {
    if (isOpen && productId) {
      refetch();
    }
  }, [productId, refetch, isOpen]);

  // Fetch signed image URLs when data changes
  useEffect(() => {
    async function fetchSignedUrls() {
      if (!data || !Array.isArray(data.documents)) {
        setSignedImageUrls([]);
        return;
      }
      const imageDocs = data.documents.filter(
        (doc: any) => doc.mimeType && doc.mimeType.startsWith('image')
      );
      if (imageDocs.length === 0) {
        setSignedImageUrls([]);
        return;
      }
      const ids = imageDocs.map((doc: any) => doc.uuid);
      try {
        const res = await documentsApi.bulkDownload(ids);
        setSignedImageUrls(res.urls || []);
      } catch {
        setSignedImageUrls([]);
      }
    }
    fetchSignedUrls();
  }, [data]);

  return (
    <Slider
      open={isOpen} // Use controlled or local state
      setOpen={setIsOpen} // Use controlled or local setter
      edit={false}
      title={'Item Details'}
      buttonText="view vendor"
    >
      {isLoading && (
        <div className="flex justify-center items-center py-10 h-screen">
          Loading
        </div>
      )}

      {error && (
        <p className="text-red-600 text-center">
          Error fetching vendor details: {error.message}
        </p>
      )}

      {!data ||
        (Object.keys(data).length === 0 && (
          <p className="text-gray-500 text-center">No Item data available.</p>
        ))}

      {data && (
        <div className="relative h-screen place-items-center w-full max-w-4xl">
          {/* Header */}
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Name" value={data.name} height />
            <Text name="Status" value={data.status} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Cost" value={data.cost} height />
            <Text
              name="Category"
              value={
                data.category && typeof data.category === 'object'
                  ? data.category.name
                  : ''
              }
              height
            />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Description" value={data.description} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="" className="mb-3 text-gray-900 font-bold">
                Images
              </label>
              {signedImageUrls.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {signedImageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Product image ${idx + 1}`}
                      className="h-20 w-20 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="w-full gap-3">
              <Text name="SKU" value={data.sku} height />
            </div>
            {data.taxable && (
              <Text name="Tax Rate" value={data.taxRate} height />
            )}
            <Text name="Cost" value={data.cost} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text
              name="Unit of Measurement"
              value={data.unitOfMeasure}
              height
            />

            <Text name="Inventory Level" value={data.inventoryLevel} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Created At" value={data.createdAt} height />
          </div>

          {/* <div className="text-center md:text-right mt-4 md:flex md:justify-end space-x-4">
            <Button
              text="Cancel"
              type="button"
              theme="gray"
              color={true}
              onClick={() => setIsSliderOpen(false)}
            />
          </div> */}
        </div>
      )}
    </Slider>
  );
};

export default ViewProductSlider;
