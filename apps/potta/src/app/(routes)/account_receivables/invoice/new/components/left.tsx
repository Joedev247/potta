'use client'; // For Next.js 13+ App Directory
import Input from '@potta/components/input';
import SearchSelect from '@potta/components/search-select';
import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import DynamicTable from './newtableInvoice';
import Button from '@potta/components/button';
import { ContextData } from '@potta/components/context';
import useGetAllCustomers from '@potta/app/(routes)/customers/hooks/useGetAllCustomers';
import SliderCustomer from '@potta/app/(routes)/customers/components/customerSlider';
import Select from '@potta/components/select';
import { Customer } from '@potta/app/(routes)/customers/utils/types';
import TextArea from '@potta/components/textArea';
import toast from 'react-hot-toast';
import { DateInput } from '@potta/components/customDatePicker';
import { useRouter } from 'next/navigation';
import useCreateInvoice from '../../_hooks/useCreateInvoice';

// Define Option interface to match the one in SearchSelect component
interface Option {
  label: string;
  value: string | number;
}

// Add these interfaces at the top of your file with the other interfaces
interface TableItem {
  name: string;
  qty: number;
  price: number;
  tax: number;
  productId: string;
  uuid: string;
  id: number;
}

interface LineItemsDto {
  description: string;
  quantity: number;
  discountCap: number;
  discountType: string;
  unitPrice: number;
  taxRate: number;
  discountRate: number;
  productId: string;
}

// Add validation errors interface
interface ValidationErrors {
  issueDate?: string;
  dueDate?: string;
  customerName?: string;
  billingAddress?: string;
  lineItems?: string;
  paymentMethod?: string;
}

interface LeftProps {
  initialInvoiceType?: string | null;
}

const Left = ({ initialInvoiceType }: LeftProps) => {
  const context = useContext(ContextData);
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('');
  const { data, isLoading: customersLoading } = useGetAllCustomers({
    page: 1,
    limit: 100,
  });
  const customers: Customer[] = data?.data || [];
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [invoice, setInvoice] = useState('Invoice');
  const [customerName, setCustomerName] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Option | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState('0025');
  const [currency, setCurrency] = useState('USD');
  const [invoiceType, setInvioceType] = useState(
    initialInvoiceType ? mapTypeToLabel(initialInvoiceType) : 'Invoice'
  );
  const [invoiceTypeDisabled, setInvoiceTypeDisabled] = useState(
    !!initialInvoiceType
  );
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [isAddCustomerDrawer, setIsAddCustomerDrawer] = useState(false);
  const [taxRate, setTaxRate] = useState(0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Use a ref to track if initial selection has been made
  const initialSelectionMade = useRef(false);

  // Create customer options with proper typing
  const customerOptions: Option[] = customers.map((customer: Customer) => ({
    label:
      customer.firstName ||
      customer.lastName ||
      `Customer ${customer.customerId || customer.uuid.slice(0, 8)}`,
    value: customer.uuid,
  }));

  // Set default customer only once when data first loads
  useEffect(() => {
    if (
      customers.length > 0 &&
      !customerName &&
      !initialSelectionMade.current &&
      !selectedCustomer
    ) {
      const firstCustomer = customers[0];
      const firstOption = {
        label:
          firstCustomer.firstName ||
          firstCustomer.lastName ||
          `Customer ${
            firstCustomer.customerId || firstCustomer.uuid.slice(0, 8)
          }`,
        value: firstCustomer.uuid,
      };

      initialSelectionMade.current = true;
      setCustomerName(firstCustomer.uuid);
      setSelectedCustomer(firstOption);
      // Update context data
      context?.setData((prevData: any) => ({
        ...prevData,
        customerName: firstCustomer.uuid,
      }));
    }
  }, [customers, customerName, context, selectedCustomer]);

  // Map URL type param to select label
  function mapTypeToLabel(type: string) {
    switch (type.toLowerCase()) {
      case 'invoice':
        return 'Invoice';
      case 'proforma':
      case 'proformainvoice':
        return 'Performa Invoice';
      case 'prepayment':
      case 'prepaymentinvoice':
        return 'Prepayment Invoice';
      default:
        return 'Invoice';
    }
  }

  // If the initialInvoiceType changes (shouldn't, but for safety), update state
  useEffect(() => {
    if (initialInvoiceType) {
      setInvioceType(mapTypeToLabel(initialInvoiceType));
      setInvoiceTypeDisabled(true);
    }
  }, [initialInvoiceType]);

  // Sync local state with context.data when it changes (for dummy data fill)
  useEffect(() => {
    if (context?.data) {
      setIssueDate(context.data.issueDate || '');
      setDueDate(context.data.dueDate || '');
      setBillingAddress(context.data.billing || '');
      setShippingAddress(context.data.shipping || '');
      setNote(context.data.note || '');
      setPaymentTerms(context.data.paymentTerms || '');
      setPaymentReference(context.data.paymentReference || '');
      setTaxRate(context.data.taxRate || 0);
      setInvoiceNumber(context.data.invoiceNumber || '');
      setCurrency(context.data.currency || 'USD');
      setInvioceType(context.data.invoiceType || 'Invoice');
      // Add more fields as needed
    }
  }, [context?.data]);

  const handleInputChange = (key: string, value: any) => {
    console.log(`Changing ${key} to:`, value);

    // Clear error for this field if it exists
    if (errors[key as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }

    // Update local state
    switch (key) {
      case 'issueDate':
        setIssueDate(value);
        break;
      case 'dueDate':
        setDueDate(value);
        break;
      case 'invoice':
        setInvoice(value);
        break;
      case 'invoiceNumber':
        setInvoiceNumber(value);
        break;
      case 'customerName':
        setCustomerName(value);
        break;
      case 'currency':
        setCurrency(value);
        break;
      case 'note':
        setNote(value);
        break;
      case 'invoiceType':
        setInvioceType(value);
        break;
      case 'billing':
        setBillingAddress(value);
        break;
      case 'shipping':
        setShippingAddress(value);
        break;
      case 'paymentReference':
        setPaymentReference(value);
        break;
      case 'paymentTerms':
        setPaymentTerms(value);
        break;
      case 'taxRate':
        setTaxRate(value);
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
      payment_method: [option], // Array with single value
    }));
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    // Required field validation
    if (!issueDate) newErrors.issueDate = 'Issue date is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    if (!customerName) newErrors.customerName = 'Customer is required';
    // Removed billing address validation as it's no longer required
    if (!selectedPaymentMethod)
      newErrors.paymentMethod = 'Payment method is required';

    // Check if there are line items
    const tableData = context?.data?.table || [];
    if (tableData.length === 0)
      newErrors.lineItems = 'At least one item is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const mutation = useCreateInvoice();
  const handleSaveInvoice = () => {
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
      discountCap: 0,
      discountType: 'PercentageWithCap',
      unitPrice: Number(item.price),
      taxRate: item.tax,
      discountRate: 0,
      productId: item.uuid,
    }));

    // Calculate total amount with proper typing
    const totalAmount = tableData.reduce((sum: number, item: TableItem) => {
      const itemTotal = item.qty * item.price;
      const itemTax = (itemTotal * item.tax) / 100;
      return sum + itemTotal + itemTax;
    }, 0);

    const InvoiceData = {
      issuedDate: issueDate, // Convert string to Date object
      dueDate: dueDate, // Convert string to Date object
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      invoiceType: invoiceType,
      currency: currency,
      taxRate: Number(taxRate),
      // totalAmount: totalAmount,
      paymentTerms: paymentTerms,
      paymentReference: paymentReference, // or generate a unique reference
      notes: note,
      paymentMethod: selectedPaymentMethod,
      invoiceNumber: invoiceNumber,
      // discountAmount: 0, // Add default or actual value if available
      customerId: customerName, // Using the customer UUID as customerId
      // salePersonId: 'c9c0c3a4-353f-4907-a342-ae64e629936f', // property salePersonId should not exist
      lineItems: lineItems,
    };

    // Save to context
    context?.setData((prevData: any) => ({
      ...prevData,
      saleReceipt: InvoiceData,
    }));

    console.log('Raw Sale Receipt Data:', InvoiceData);
    mutation.mutate(InvoiceData, {
      onSuccess: () => {
        toast.success(`${InvoiceData.invoiceType} created successfully`);
        router.push('/account_receivables');
        // You can add navigation or other actions here after successful creation
        // For example: router.push('/pos/sales');
      },
      onError: (error: any) => {
        toast.error(
          `Failed to create Invoice: ${error.message || 'Unknown error'}`
        );
        console.error('Error creating Invoice Please Try again later:', error);
      },
    });
    // Also log the raw data object if needed
  };

  // Helper function to render required field marker
  const RequiredMark = () => <span className="text-red-500 ml-1">*</span>;

  return (
    <div className="max-w-5xl min-w-5xl px-2 bg-transparent overflow-y-auto scroll bg-white ">
      <div className="w-full grid grid-cols-4 gap-4">
        <div>
          <Select
            label="Currency"
            options={[
              { label: 'USD($)', value: 'USD' },
              { label: 'EUR(€)', value: 'EUR' },
              { label: 'XAF', value: 'XAF' },
            ]}
            selectedValue={currency}
            onChange={(value: any) => handleInputChange('currency', value)}
            bg={''}
          />
        </div>
        <div className={`${errors.issueDate ? 'error-field' : ''}`}>
          <DateInput
            label="Issued Date"
            name="issueDate"
            value={issueDate ? new Date(issueDate) : undefined}
            onChange={(date) =>
              handleInputChange(
                'issueDate',
                date ? date.toISOString().slice(0, 10) : ''
              )
            }
            placeholder="Select issue date"
            required
            errors={errors.issueDate as any}
          />
        </div>
        <div className={`${errors.dueDate ? 'error-field' : ''}`}>
          <DateInput
            label="Due Date"
            name="dueDate"
            value={dueDate ? new Date(dueDate) : undefined}
            onChange={(date) =>
              handleInputChange(
                'dueDate',
                date ? date.toISOString().slice(0, 10) : ''
              )
            }
            placeholder="Select due date"
            required
            errors={errors.dueDate as any}
          />
        </div>
      </div>

      <div className="mt-3 w-full flex flex-col">
        <div
          className={`w-[50%] flex items-center space-x-3 ${
            errors.customerName ? 'error-field' : ''
          }`}
        >
          <div className="w-full">
            <SearchSelect
              label="Customer"
              options={customerOptions}
              value={selectedCustomer}
              onChange={(option: Option | null) => {
                console.log('SearchSelect onChange called with:', option);
                setSelectedCustomer(option);
                handleInputChange('customerName', option?.value || '');
              }}
              isLoading={customersLoading}
              placeholder="Select a customer..."
              isClearable={true}
              isSearchable={true}
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>
          <div className="h-full mt-8 flex items-center">
            <button
              type="button"
              onClick={() => setIsAddCustomerDrawer(true)}
              className="flex items-center justify-center text-white bg-green-700 rounded-full size-10"
            >
              <i className="ri-add-line text-3xl"></i>
            </button>
          </div>
        </div>
        <div className="flex space-x-4 mt-4">
          <div className="w-full">
            <Input
              type="text"
              label="Billing Address"
              name="billing"
              value={billingAddress}
              onchange={(e: any) =>
                handleInputChange('billing', e.target.value)
              }
            />
          </div>
          <div className="w-full">
            <Input
              type="text"
              label="Shipping Address"
              name="shipping"
              value={shippingAddress}
              onchange={(e: any) =>
                handleInputChange('shipping', e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className="my-5 pt-10">
        <h3 className="text-lg mb-2 text-gray-900 font-medium">
          Line Items
          <RequiredMark />
        </h3>
        <DynamicTable />
        {errors.lineItems && (
          <p className="text-red-500 text-sm mt-1">{errors.lineItems}</p>
        )}
      </div>

      <hr className="my-5" />
      <h3 className="text-lg font-medium my-2">
        Payment Methods
        <RequiredMark />
      </h3>
      <div className={`mt-2 ${errors.paymentMethod ? 'error-field' : ''}`}>
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
        <Input
          type="text"
          label="Payment Reference"
          name="paymentReference"
          value={paymentReference}
          onchange={(e: any) =>
            handleInputChange('paymentReference', e.target.value)
          }
        />
        <Input
          type="number"
          label="Tax Rate"
          name="taxRate"
          value={taxRate}
          onchange={(e: any) => handleInputChange('taxRate', e.target.value)}
        />
        <TextArea
          label="Payment Terms"
          name="paymentTerms"
          value={paymentTerms}
          onchange={(e: any) =>
            handleInputChange('paymentTerms', e.target.value)
          }
        />
      </div>

      <hr className="my-5" />
      <h3 className="text-xl  my-2">Notes</h3>
      <textarea
        value={note}
        onChange={(e) => handleInputChange('note', e.target.value)}
        className="h-36 border p-2 w-full outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-10"
      ></textarea>

      <div className="fixed bottom-0 left-0 right-0 p-2 bg-white border-t border-gray-200 flex justify-end space-x-3">
        {' '}
        <Button
          text={'Save Invoice'}
          onClick={handleSaveInvoice}
          type={'button'}
        />
      </div>
      <SliderCustomer
        open={isAddCustomerDrawer}
        setOpen={setIsAddCustomerDrawer}
      />
    </div>
  );
};

export default Left;
