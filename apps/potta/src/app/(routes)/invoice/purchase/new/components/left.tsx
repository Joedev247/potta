'use client'; // For Next.js 13+ App Directory
import Input from '@potta/components/input';
import SearchSelect from '@potta/components/search-select';
import { useContext, useState, useEffect, useRef } from 'react';
import DynamicTable from './newtableInvoice';
import Button from '@potta/components/button';
import { ContextData } from '@potta/components/context';
import useGetAllVendors from '@potta/app/(routes)/vendors/hooks/useGetAllVendors';
import Select from '@potta/components/select';

import toast from 'react-hot-toast';
import TextArea from '@potta/components/textArea';
import useCreatePurchaseOrder from '../hooks/useCreatePurchase';

// Define Option interface to match the one in SearchSelect component
interface Option { 
  label: string;
  value: string | number;
}

// Add these interfaces at the top of your file with the other interfaces
interface TableItem {
  name: string;
  qty: number;
  productId: string;
  uuid: string;
  id: number;
}

interface LineItemsDto {
  description: string;
  quantity: number;
  productId: string;
}

// Add validation errors interface
interface ValidationErrors {
  orderDate?: string;
  requiredDate?: string;
  vendorId?: string;
  shoppingAddress?: string;
  lineItems?: string;
  paymentMethod?: string;
}

const Left = () => {
  const context = useContext(ContextData);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  
  // Vendor data fetch
  const { data: vendorData, isLoading: vendorsLoading } = useGetAllVendors({
    page: 1,
    limit: 100,
  });
  const vendors = vendorData?.data || [];
  
  // Form state variables
  const [orderDate, setOrderDate] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Option | null>(null);
  const [orderNumber, setOrderNumber] = useState(
  );
  const [shoppingAddress, setShoppingAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Use a ref to track if initial selection has been made
  const initialVendorSelectionMade = useRef(false);

  // Create vendor options
  const vendorOptions: Option[] = vendors.map((vendor: any) => ({
    label: vendor.name || `Vendor ${vendor.vendorId || vendor.uuid.slice(0, 8)}`,
    value: vendor.uuid,
  }));

  // Set default vendor when data loads
  useEffect(() => {
    if (
      vendors.length > 0 &&
      !vendorId &&
      !initialVendorSelectionMade.current &&
      !selectedVendor
    ) {
      const firstVendor = vendors[0];
      const firstOption = {
        label: firstVendor.name || `Vendor ${firstVendor.vendorId || firstVendor.uuid.slice(0, 8)}`,
        value: firstVendor.uuid,
      };

      initialVendorSelectionMade.current = true;
      setVendorId(firstVendor.uuid);
      setSelectedVendor(firstOption);
      
      // Update context data
      context?.setData((prevData: any) => ({
        ...prevData,
        vendorId: firstVendor.uuid,
      }));
    }
  }, [vendors, vendorId, context, selectedVendor]);

  const handleInputChange = (key: string, value: any) => {
    console.log(`Changing ${key} to:`, value);

    // Clear error for this field if it exists
    if (errors[key as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }

    // Update local state
    switch (key) {
      case 'orderDate':
        setOrderDate(value);
        break;
      case 'requiredDate':
        setRequiredDate(value);
        break;
      case 'orderNumber':
        setOrderNumber(value);
        break;
      case 'vendorId':
        setVendorId(value);
        break;
      case 'note':
        setNote(value);
        break;
      case 'shoppingAddress':
        setShoppingAddress(value);
        break;
      case 'paymentTerms':
        setPaymentTerms(value);
        break;
      default:
        break;
    }
    
    // Update context data
    context?.setData((prevData: any) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handlePaymentMethodClick = (option: string) => {
    // If clicking the same option, don't deselect it
    if (selectedPaymentMethod === option) {
      return;
    }

    setSelectedPaymentMethod(option);

    // Clear payment method error if it exists
    if (errors.paymentMethod) {
      setErrors((prev) => ({ ...prev, paymentMethod: undefined }));
    }

    // Update context data with single payment method
    context?.setData((prevData: any) => ({
      ...prevData,
      paymentMethod: option, // String value instead of array
    }));
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    // Required field validation
    if (!orderDate) newErrors.orderDate = 'Order date is required';
    if (!requiredDate) newErrors.requiredDate = 'Required date is required';
    if (!vendorId) newErrors.vendorId = 'Vendor is required';
    if (!shoppingAddress) newErrors.shoppingAddress = 'Shipping address is required';
    if (!selectedPaymentMethod) newErrors.paymentMethod = 'Payment method is required';

    // Check if there are line items
    const tableData = context?.data?.table || [];
    if (tableData.length === 0)
      newErrors.lineItems = 'At least one item is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mutation = useCreatePurchaseOrder();
  const handleSavePurchaseOrder = () => {
    setFormSubmitted(true);

    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-field');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Get table data from context with type annotation
    const tableData: TableItem[] = context?.data?.table || [];

    // Format line items according to LineItemsDto structure with proper typing
    const lineItems: LineItemsDto[] = tableData.map((item: TableItem) => ({
      description: item.name,
      quantity: item.qty,
      productId: item.uuid,
    }));

    const purchaseOrderData = {
      orderNumber: orderNumber,
      orderDate: orderDate,
      requiredDate: requiredDate,
      shoppingAddress: shoppingAddress,
      paymentTerms: paymentTerms,
      paymentMethod: selectedPaymentMethod,
      vendorId: vendorId,
      notes: note,
      lineItems: lineItems,
    };

    // Save to context
    context?.setData((prevData: any) => ({
      ...prevData,
      purchaseOrder: purchaseOrderData,
    }));

    console.log('Purchase Order Data:', purchaseOrderData);
    mutation.mutate(purchaseOrderData, {
      onSuccess: () => {
        toast.success(`Purchase Order created successfully`);
      },
      onError: (error: any) => {
        toast.error(
          `Failed to create Purchase Order: ${error.message || 'Unknown error'}`
        );
      },
    });
  };

  // Helper function to render required field marker
  const RequiredMark = () => <span className="text-red-500 ml-1">*</span>;

  return (
    <>
       <div className="max-w-5xl min-w-5xl px-2 bg-transparent overflow-y-auto scroll bg-white ">
       <div className="w-full  gap-4">
        
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Input
              type="text"
              label="Order Number"
              name="orderNumber"
              value={orderNumber}
              onchange={(e: any) => handleInputChange('orderNumber', e.target.value)}
              
            />
            <div className={`${errors.orderDate ? 'error-field' : ''}`}>
              <span className="mb-3 text-gray-900 font-medium">
                Order Date
                <RequiredMark />
              </span>
              <input
                name="orderDate"
                type={'date'}
                value={orderDate}
                onChange={(e: any) => handleInputChange('orderDate', e.target.value)}
                className={`w-full py-2.5 px-4 border ${
                  errors.orderDate ? 'border-red-500' : 'border-gray-200'
                } rounded-[2px] outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.orderDate && (
                <p className="text-red-500 text-sm mt-1">{errors.orderDate}</p>
              )}
            </div>
            
            <div className={`${errors.requiredDate ? 'error-field' : ''}`}>
              <span className="mb-3 text-gray-900 font-medium">
                Required Date
                <RequiredMark />
              </span>
              <input
                name="requiredDate"
                type={'date'}
                value={requiredDate}
                onChange={(e: any) => handleInputChange('requiredDate', e.target.value)}
                className={`w-full py-2.5 px-4 border ${
                  errors.requiredDate ? 'border-red-500' : 'border-gray-200'
                } rounded-[2px] outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.requiredDate && (
                <p className="text-red-500 text-sm mt-1">{errors.requiredDate}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className={`${errors.vendorId ? 'error-field' : ''}`}>
              <SearchSelect
                label={<>Vendor<RequiredMark /></>}
                options={vendorOptions}
                value={selectedVendor}
                onChange={(option: Option | null) => {
                  console.log('Vendor SearchSelect onChange called with:', option);
                  setSelectedVendor(option);
                  handleInputChange('vendorId', option?.value || '');
                }}
                isLoading={vendorsLoading}
                placeholder="Select a vendor..."
                isClearable={true}
                isSearchable={true}
              />
              {errors.vendorId && (
                <p className="text-red-500 text-sm mt-1">{errors.vendorId}</p>
              )}
            </div>
          <div className={` ${errors.shoppingAddress ? 'error-field' : ''}`}>
            <Input
              type="text"
              label={<>Shipping Address<RequiredMark /></>}
              name="shoppingAddress"
              value={shoppingAddress}
              onchange={(e: any) => handleInputChange('shoppingAddress', e.target.value)}
            />
            {errors.shoppingAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.shoppingAddress}</p>
            )}
          </div>
          </div>
          
        </div>

        <div className="my-6">
          <h3 className="text-lg font-medium mb-2">
            Order Items
            <RequiredMark />
          </h3>
          <DynamicTable />
          {errors.lineItems && (
            <p className="text-red-500 text-sm mt-1">{errors.lineItems}</p>
          )}
        </div>

        <hr className="my-6" />
        <h3 className="text-lg font-medium mb-4">
          Payment Information
          <RequiredMark />
        </h3>
        <div className={`${errors.paymentMethod ? 'error-field' : ''}`}>
          <div className="grid grid-cols-2 py-4 gap-4">
            {['Credit Card', 'Bank Transfer', 'Other', 'ACH Transfer'].map(
              (option) => (
                <div
                  key={option}
                  onClick={() => handlePaymentMethodClick(option)}
                  className={`p-4 border cursor-pointer ${
                    selectedPaymentMethod === option
                      ? 'border-green-500 text-green-500'
                      : errors.paymentMethod && formSubmitted
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPaymentMethod === option}
                      onChange={() => handlePaymentMethodClick(option)}
                      className="mr-2 text-xl"
                      name="paymentMethod"
                    />
                    <span>{option.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                  </div>
                </div>
              )
            )}
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm col-span-2">
                {errors.paymentMethod}
              </p>
            )}
          </div>
          
          <div className="mt-4">
            <TextArea
              label="Payment Terms"
              name="paymentTerms"
              value={paymentTerms}
              onchange={(e: any) => handleInputChange('paymentTerms', e.target.value)}
              placeholder="Specify payment terms and conditions"
            />
          </div>
        </div>

        <hr className="my-6" />
        <h3 className="text-lg font-medium mb-2">Additional Notes</h3>
        <textarea
          value={note}
          onChange={(e) => handleInputChange('note', e.target.value)}
          className="h-36 border p-2 w-full outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add any notes or special instructions for this purchase order"
        ></textarea>

        <div className="mt-6 w-full flex justify-end">
          <Button
            text="Create Purchase Order"
            onClick={handleSavePurchaseOrder}
            type="button"
          />
        </div>
      </div>
    </>
  );
};

export default Left;