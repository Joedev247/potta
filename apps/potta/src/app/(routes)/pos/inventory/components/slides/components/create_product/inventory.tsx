import React, { useContext, useState, useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Control, Controller } from 'react-hook-form';
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
import ImageUploader, {
  getSelectedImageFile,
  clearSelectedImageFile,
} from '../../../imageUploader';
import { productApi } from '../../../../_utils/api';
import useGetAllProductCategories from '../../../../_hooks/useGetAllProductCategories';
import Select from '@potta/components/select';

interface CreateProductProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  productType?: 'PHYSICAL' | 'SERVICE';
}

const CreateProduct: React.FC<CreateProductProps> = ({
  open: controlledOpen,
  setOpen: setControlledOpen,
  productType = 'PHYSICAL',
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
      unitOfMeasure: '',
      cost: 0,
      sku: '',
      inventoryLevel: productType === 'PHYSICAL' ? 0 : 0,
      reorderPoint: 0,
      salesPrice: 0,
      taxable: false,
      categoryId: '',
      taxId: '',
      images: [],
      type: productType,
      structure: 'SIMPLE',
    },
  });

  const mutation = useCreateProduct();

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllProductCategories();
  const categoryOptions = (categoriesData?.data || []).map(
    (cat: { uuid: string; name: string }) => ({
      label: cat.name,
      value: cat.uuid,
    })
  );

  const onSubmit = async (formData: ProductPayload) => {
    try {
      console.log('Form submitted with data:', formData);

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
            formData.images = [uploadResult.link];
            console.log('Image uploaded successfully, URL:', uploadResult.link);
          } else {
            setIsUploading(false);
            toast.error('Image upload failed: No link returned from server');
            return;
          }
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          setIsUploading(false);
          toast.error('Image upload failed. Please try again.');
          return;
        }

        setIsUploading(false);
      } else {
        formData.images = [];
      }

      // Validate required fields
      if (
        !formData.name ||
        !formData.sku ||
        !formData.cost ||
        !formData.salesPrice
      ) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Ensure the payload has the correct structure
      const payload = {
        ...formData,
        type: productType,
        structure: 'SIMPLE',
        inventoryLevel: productType === 'SERVICE' ? 0 : formData.inventoryLevel,
      };

      console.log('Submitting product data:', payload);
      mutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Product created successfully!');
          reset();
          setIsOpen(false);
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
      title={productType === 'PHYSICAL' ? 'Physical Item' : 'Service Item'}
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
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Category"
                  options={categoryOptions}
                  selectedValue={field.value || ''}
                  onChange={field.onChange}
                  bg="bg-white"
                  name="categoryId"
                  required
                />
              )}
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
              <ImageUploader control={control} name="images" />
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
            <div className="mt-4">
              <Input
                type={'text'}
                label={'Tax ID'}
                placeholder="Enter Tax ID"
                name={'taxId'}
                register={register}
                errors={errors.taxId}
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
            <div className="mt-6">
              <Input
                type={'number'}
                label={'Reorder Point'}
                placeholder="50"
                name={'reorderPoint'}
                register={register}
                errors={errors.reorderPoint}
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
          </div>
        </div>
        {productType === 'PHYSICAL' && (
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
        )}
        <div className="flex-grow" />
        <div className="text-center md:text-right md:flex space-x-4 fixed bottom-0 left-0 right-0 justify-center bg-white p-4">
          <div className="flex gap-2 w-full max-w-4xl justify-between">
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
