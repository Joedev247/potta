import MyDropzone from '@potta/components/dropzone';
import Select from '@potta/components/select';
import React, { useContext, useState } from 'react';
import Inventory from './components/inventory';
import Unit from './components/units';
import { yupResolver } from '@hookform/resolvers/yup';

import Notes from './components/notes';
import Attachments from './components/attachments';
import Button from '@potta/components/button';
import { ContextData } from '@potta/components/context';
import Input from '@potta/components/input';
import Checkbox from '@potta/components/checkbox';
import { Controller, useForm } from 'react-hook-form';
import {
  ProductPayload,
  productSchema,
  UpdateProductPayload,
  UpdateProductSchema,
} from '../../../../_utils/validation';
import useCreateProduct from '../../../../_hooks/useCreateProduct';
import toast from 'react-hot-toast';
import useUpdateProduct from '../../../../_hooks/useUpdateProduct';
import Slider from '@potta/components/slideover';
import TextArea from '@potta/components/textArea';

interface EditProductProps {
  product: ProductPayload | null; // Existing product data
  productId: string; // ID of the product to be edited
  open?: boolean; // Optional controlled open state
  setOpen?: (open: boolean) => void; // Optional setter from parent
}
const EditProduct: React.FC<EditProductProps> = ({
  product,
  productId,
  open: controlledOpen,
  setOpen: setControlledOpen,
}) => {
  // Local state as fallback if no controlled state is provided
  const [localOpen, setLocalOpen] = useState(false);

  // Determine which open state to use
  const isOpen = controlledOpen ?? localOpen;
  const setIsOpen = setControlledOpen ?? setLocalOpen;
  const [data, setData] = useState('inventory');
  const context = useContext(ContextData);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UpdateProductPayload>({
    resolver: yupResolver(UpdateProductSchema),
    defaultValues: product || {
      name: '',
      description: '',
      unitOfMeasure: undefined,
      cost: 0,
      sku: '',
      inventoryLevel: 0,
      salesPrice: 0,
      taxable: false,
      taxRate: 0,
      category: '',
      image: '',
      status: undefined,
    },
  });
  const ProductStatusEnum = [
    { value: 'pending', label: 'Pending' },
    { value: 'schedule', label: 'Schedule' },
    { value: 'complete', label: 'Complete' },
    { value: 'enabled', label: 'Enabled' },
    { value: 'disabled', label: 'Disabled' },
    { value: 'available', label: 'Available' },
    { value: 'expired', label: 'Expired' },
    { value: 'taken', label: 'Taken' },
  ];

  const mutation = useUpdateProduct(productId);
  const onSubmit = (data: UpdateProductPayload) => {
    console.log('Submitted Data:', data);
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success('Product Updated successfully!');
        reset(); // Reset the form after success
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error('Failed to Update product');
      },
    });
  };

  return (
    <Slider
      open={isOpen}
      setOpen={setIsOpen}
      edit={false}
      buttonText={'update product'}
      title={'Edit Product'}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative h-[97%] w-full max-w-4xl"
      >
        <div className="w-full">
          <Input
            label="Product Name"
            type="text"
            name="name"
            placeholder="Enter Product name"
            register={register}
            errors={errors.name}
          />
        </div>
        <div className="w-full grid mt-5 grid-cols-2 gap-2">
          <div className="w-full">
            <Input
              label="Category"
              type="text"
              name="category"
              placeholder="Enter Category"
              register={register}
              errors={errors.category}
            />
          </div>
          <div className="w-full">
            <Input
              label="Cost"
              type="number"
              name="cost"
              placeholder="Enter Product Cost"
              register={register}
              errors={errors.cost}
            />
          </div>
        </div>
        <div className="w-full mt-5">
          <TextArea
            label="Description"
            name="description"
            placeholder="Product Description.."
            register={register}
            errors={errors.description}
            height={true}
          />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-5">
          <div>
            <div>
              <label htmlFor="" className="mb-3 text-gray-900 font-medium">
                Image
              </label>
              <MyDropzone />
            </div>
            <div className="mt-4">
              <Input
                type={'text'}
                label={'SKU'}
                placeholder="Enter SKU"
                name={'sku'}
                register={register}
                errors={errors.sku}
              />
            </div>
          </div>
          <div className="w-full">
            <div className="mt-6">
              <Input
                type={'number'}
                label={'Sales Price'}
                placeholder="760"
                name={'salesPrice'}
                register={register}
                errors={errors.salesPrice}
              />
            </div>
            <div className="mt-6 flex flex-col items-start ">
              <Checkbox
                label="Taxable"
                name="taxable"
                control={control}
                errors={errors.taxable}
              />
            </div>
            <div className="mt-6">
              <Input
                type={'number'}
                label={'Tax Rate'}
                placeholder="Enter tax rate"
                name={'taxRate'}
                register={register}
                errors={errors.taxRate}
              />
            </div>
            <div className="mt-6">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    options={ProductStatusEnum}
                    selectedValue={field.value}
                    onChange={field.onChange}
                    bg="bg-white"
                    name="Select Status"
                    label="Status"
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="mt-12">
          <div className="flex ">
            {/* <div
            onClick={() => setData('units')}
            className={`px-4 py-2 bg-green-50 cursor-pointer ${
              data == 'units' && 'border-b-2 border-green-500 text-green-500'
            }`}
          >
            <p>Units</p>
          </div> */}
            <div
              onClick={() => setData('inventory')}
              className={`px-4 py-2 bg-green-50 cursor-pointer ${
                data == 'inventory' &&
                'border-b-2 border-green-500 text-green-500'
              }`}
            >
              <p>Inventory</p>
            </div>
            {/* <div
            onClick={() => setData('notes')}
            className={`px-4 py-2 bg-green-50 cursor-pointer ${
              data == 'notes' && 'border-b-2 border-green-500 text-green-500'
            }`}
          >
            <p>Notes</p>
          </div>
          <div
            onClick={() => setData('attachement')}
            className={`px-4 py-2 bg-green-50 cursor-pointer ${
              data == 'attachement' &&
              'border-b-2 border-green-500 text-green-500'
            }`}
          >
            <p>Attachements</p>
          </div> */}
          </div>
          <div className="mt-8 pb-20">
            {data == 'inventory' && (
              <Inventory
                control={control}
                register={register}
                errors={errors}
              />
            )}
            {/* {data == 'units' && <Unit />} */}
            {/* {data == 'notes' && <Notes />} */}
            {/* {data == 'attachement' && <Attachments />} */}
          </div>
        </div>
        <div className="flex-grow" /> {/* This div takes up remaining space */}
        <div className="text-center md:text-right md:flex md:justify-end space-x-4 fixed bottom-0 left-0 right-0 bg-white p-4">
          <Button
            text={'Update Product'}
            theme="lightBlue"
            type={'submit'}
            isLoading={mutation.isPending}
          />
          <Button
            text="Cancel"
            type="button"
            theme="gray"
            color={true}
            onClick={() => setIsOpen(false)}
          />
        </div>
      </form>
    </Slider>
  );
};
export default EditProduct;
