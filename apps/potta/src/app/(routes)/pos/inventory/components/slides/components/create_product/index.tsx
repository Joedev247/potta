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
import { useForm } from 'react-hook-form';
import { ProductPayload, productSchema } from '../../../../_utils/validation';
import useCreateProduct from '../../../../_hooks/useCreateProduct';
import toast from 'react-hot-toast';
import Slider from '@potta/components/slideover';
import TextArea from '@potta/components/textArea';

const CreateProduct = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [data, setData] = useState('inventory');
  const context = useContext(ContextData);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProductPayload>({
    resolver: yupResolver(productSchema),
    defaultValues: {
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
    },
  });

  const mutation = useCreateProduct();
  const onSubmit = (data: ProductPayload) => {
    console.log('Submitted Data:', data);
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success('Product created successfully!');
        reset(); // Reset the form after success
        setIsSliderOpen(false);
      },
      onError: (error) => {
        toast.error('Failed to create product');
      },
    });
  };

  return (
    <Slider
      open={isSliderOpen}
      setOpen={setIsSliderOpen}
      edit={true}
      buttonText={'Create Product'}
      title={'Create Product'}
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
              <label htmlFor="" className='mb-3 text-gray-900 font-medium'>Image</label>
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
          </div>
        </div>
        <div className="mt-12 pb-20">
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
            onClick={() => setData('attachment')}
            className={`px-4 py-2 bg-green-50 cursor-pointer ${
              data == 'attachement' &&
              'border-b-2 border-green-500 text-green-500'
            }`}
          >
            <p>Attachements</p>
          </div> */}
          </div>
          <div className="mt-8">
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

<div className="text-center md:text-right  md:flex md:justify-end space-x-4 fixed bottom-0 left-0 right-0 bg-white p-4">
          <div className="flex space-x-2">
            {/* <div>
              <Button
                text={'Save and New'}
                theme="lightBlue"
                type={'submit'}
                isLoading={mutation.isPending}
              />
            </div> */}
            <div>
              <Button
                text={'Save '}
                type={'submit'}
                isLoading={mutation.isPending}
              />
            </div>
          </div>
        </div>
      </form>
    </Slider>
  );
};
export default CreateProduct;
