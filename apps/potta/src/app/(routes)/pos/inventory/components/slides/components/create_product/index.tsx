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
const CreateProduct = () => {
  const [data, setData] = useState('inventory');
  const context = useContext(ContextData);
  const {
      register,
      handleSubmit,
      control,
      formState: { errors }, reset
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
    })

 const mutation = useCreateProduct()
 const onSubmit = (data: ProductPayload) => {
   console.log('Submitted Data:', data);
   mutation.mutate(data,{
     onSuccess: () => {
       toast.success('Product created successfully!');
       reset(); // Reset the form after success
     },
     onError: (error) => {
       toast.error('Failed to create product');
     },
   });
 }


  return (
    <form
    onSubmit={handleSubmit(onSubmit)}
    className="relative h-[97%] w-full"
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
      <p className="mb-2">Description</p>
            <textarea
               {...register("description")}
                className="w-full border outline-none p-2 h-36"
                placeholder="Enter any additional notes..."
            />
            {errors.description && <small className="text-red-500">{errors.description.message}</small>}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-5">
        <div>
          <div>
            <label htmlFor="">Image</label>
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
          <label htmlFor="taxable">Taxable</label>
            <Checkbox
              name="taxable"
              type='checkbox'
              register={register}
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
        <div className="mt-8">
          {data == 'inventory' && <Inventory control={control} register={register} errors={errors}/>}
          {/* {data == 'units' && <Unit />} */}
          {/* {data == 'notes' && <Notes />} */}
          {/* {data == 'attachement' && <Attachments />} */}
        </div>
      </div>
      <div className="w-full mt-16 flex justify-end">
        <div className="flex space-x-2">
          <div>
            <Button text={'Save and New'} theme="lightBlue" type={'submit'} />
          </div>
          <div>
            <Button text={'Save in Close'} type={'submit'} />
          </div>
        </div>
      </div>
    </form>
  );
};
export default CreateProduct;
