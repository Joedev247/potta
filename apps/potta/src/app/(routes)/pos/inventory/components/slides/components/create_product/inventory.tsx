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
}

const CreateProduct: React.FC<CreateProductProps> = ({
  open: controlledOpen,
  setOpen: setControlledOpen,
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
      images: [],
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

      // Set category_id to the selected category uuid
      const selectedCategory =
        (categoriesData?.data || []).find(
          (cat: { uuid: string }) => cat.uuid === formData.category
        ) || null;
      (formData as any).categoryId = selectedCategory
        ? selectedCategory.uuid
        : '';
      // Remove category and taxRate from payload
      delete formData.category;
      delete formData.taxRate;

      console.log('Submitting product data:', formData);
      mutation.mutate(formData, {
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
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  label="Category"
                  options={categoryOptions}
                  selectedValue={field.value || ''}
                  onChange={field.onChange}
                  bg="bg-white"
                  name="category"
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
