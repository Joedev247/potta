import React, { useContext, useState, useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Control } from 'react-hook-form';
import Button from '@potta/components/button';
import { ContextData } from '@potta/components/context';
import Input from '@potta/components/input';
import Checkbox from '@potta/components/checkbox';
import TextArea from '@potta/components/textArea';
import Slider from '@potta/components/slideover';
import { ProductPayload, productSchema } from '../../../../_utils/validation';
import useCreateProduct from '../../../../_hooks/useCreateProduct';
import useUploadImage from '../../../../_hooks/useUploadFile';
import toast from 'react-hot-toast';
import Inventory from './components/inventory';
import ImageUploader, { getSelectedImageFile, clearSelectedImageFile } from '../../../imageUploader';
import { productApi } from '../../../../_utils/api';

interface CreateProductProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const CreateProduct: React.FC<CreateProductProps> = ({ 
  open: controlledOpen,
  setOpen: setControlledOpen
}) => {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = controlledOpen ?? localOpen;
  const setIsOpen = setControlledOpen ?? setLocalOpen;
  const [data, setData] = useState('inventory');
  const context = useContext(ContextData);
  const [isUploading, setIsUploading] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    getValues,
    setValue,
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
  
  const onSubmit = async (formData: ProductPayload) => {
    try {
      // Get the selected file
      const selectedFile = getSelectedImageFile();
      console.log('Selected file in onSubmit:', selectedFile);
      
      // Check if we have a file to upload
      if (selectedFile) {
        setIsUploading(true);
        
        try {
          // Upload the file
          const uploadResult = await productApi.uploadImage(selectedFile);
          
          // Update the form data with the actual image URL
          if (uploadResult && uploadResult.link) {
            formData.image = uploadResult.link;
            console.log('Image uploaded successfully, URL:', uploadResult.link);
          } else {
            // If we don't get a link back, stop the submission
            setIsUploading(false);
            toast.error('Image upload failed: No link returned from server');
            console.error('Upload succeeded but no link was returned:', uploadResult);
            return; // Stop the form submission
          }
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          setIsUploading(false);
          toast.error('Image upload failed. Please try again.');
          return; // Stop the form submission
        }
        
        setIsUploading(false);
      } else {
        console.log('No file selected, continuing with form submission without image');
      }
      
      // Now submit the form with the updated image URL
      console.log('Submitting product data:', formData);
      mutation.mutate(formData, {
        onSuccess: () => {
          toast.success('Product created successfully!');
          reset();
          setIsOpen(false);
          // Clear the selected file
          clearSelectedImageFile();
        },
        onError: (error) => {
          console.error('Product creation error:', error);
          toast.error('Failed to create product');
        },
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setIsUploading(false);
      toast.error('An unexpected error occurred');
    }
  };
  return (
    <Slider
      open={isOpen}
      setOpen={setIsOpen}
      edit={true}
      buttonText={'Create Product'}
      title={'Inventory Item'}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative h-screen w-full max-w-4xl"
      >
        {/* Form fields remain the same */}
        <div className="w-full">
          <Input
            label="Product Name"
            type="text"
            name="name"
            placeholder="Enter Product name"
            register={register}
            errors={errors.name}
            required
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
              required
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
              <ImageUploader 
                control={control} 
                name="image"
              />
            </div>
            <div className="mt-4">
              <Input
                type={'text'}
                label={'SKU'}
                placeholder="Enter SKU"
                name={'sku'}
                register={register}
                errors={errors.sku}
                required
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
                required
              />
            </div>
            <div className="mt-6 flex flex-col items-start ">
              <Checkbox
                label="Taxable"
                name="taxable"
                control={control}
                errors={errors.taxable}
                required
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
            <div
              onClick={() => setData('inventory')}
              className={`px-4 py-2 bg-green-50 cursor-pointer ${
                data == 'inventory' &&
                'border-b-2 border-green-500 text-green-500'
              }`}
            >
              <p>Inventory</p>
            </div>
          </div>
          <div className="mt-8">
            {data == 'inventory' && (
              <Inventory
                control={control}
                register={register}
                errors={errors}
              />
            )}
          </div>
        </div>
        <div className="flex-grow" />
        <div className="text-center md:text-right md:flex space-x-4 fixed bottom-0 left-0 right-0 justify-center bg-white p-4">
          <div className="flex gap-2 w-full max-w-4xl justify-between">
            <Button
              text="Cancel"
              type="button"
              theme="danger"
              onClick={() => setIsOpen(false)}
            />
            <div>
              <Button
                text={'Add Item'}
                type={'submit'}
                isLoading={mutation.isPending || isUploading}
              />
            </div>
          </div>
        </div>
      </form>
    </Slider>
  );
};

export default CreateProduct;