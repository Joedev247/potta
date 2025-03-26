'use client'; // For Next.js 13+ App Directory
import Input from '@potta/components/input';
import SearchSelect from '@potta/components/search-select';
import { useContext, useState, useEffect, useRef } from 'react';
import DynamicTable from './newtableInvoice';
import Button from '@potta/components/button';
import { ContextData } from '@potta/components/context';
import useGetAllCustomers from '@potta/app/(routes)/customers/hooks/useGetAllCustomers';
import SliderCustomer from '@potta/app/(routes)/customers/components/customerSlider';
import Select from '@potta/components/select';
import { Customer } from '../../../../customers/utils/types';

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
  discountType: string | null;
  unitPrice: number;
  taxRate: number;
  discountRate: number;
  productId: string;
}

const Left = () => {
  const context = useContext(ContextData);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const { data, isLoading: customersLoading } = useGetAllCustomers({
    page: 1,
    limit: 100,
  });
  const customers: Customer[] = data?.data || [];
  const [date, setDate] = useState('');
  const [invoice, setInvoice] = useState('Invoice');
  const [customerName, setCustomerName] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Option | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState('0025');
  const [currency, setCurrency] = useState('USD');
  const [note, setNote] = useState('');
  const [isAddCustomerDrawer, setIsAddCustomerDrawer] = useState(false);

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

  const handleInputChange = (key: string, value: any) => {
    console.log(`Changing ${key} to:`, value);

    // Update local state
    switch (key) {
      case 'date':
        setDate(value);
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

    // Update context data with single payment method
    context?.setData((prevData: any) => ({
      ...prevData,
      payment_method: [option], // Array with single value
    }));
  };

  const handleSaveInvoice = () => {
    // Get table data from context with type annotation
    const tableData: TableItem[] = context?.data?.table || [];

    // Format line items according to LineItemsDto structure with proper typing
    const lineItems: LineItemsDto[] = tableData.map((item: TableItem) => ({
      description: item.name,
      quantity: item.qty,
      discountCap: 0,
      discountType: null,
      unitPrice: item.price,
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

    const saleReceiptData = {
      saleDate: date,
      totalAmount: totalAmount,
      paymentReference: invoiceNumber, // or generate a unique reference
      notes: note,
      paymentMethod: selectedPaymentMethod,
      receiptNumber: invoiceNumber,
      discountAmount: 0, // Add default or actual value if available
      customerId: customerName, // Using the customer UUID as customerId
      salePerson: '', // Add actual salesperson if available
      lineItems: lineItems,
    };

    // Log the formatted data
    console.log('=== SALE RECEIPT DATA ===');
    console.log('SaleReceiptDto {');
    console.log(`  saleDate: "${saleReceiptData.saleDate}"`);
    console.log(`  totalAmount: ${saleReceiptData.totalAmount}`);
    console.log(`  paymentReference: "${saleReceiptData.paymentReference}"`);
    console.log(`  notes: "${saleReceiptData.notes}"`);
    console.log(`  paymentMethod: "${saleReceiptData.paymentMethod}"`);
    console.log(`  receiptNumber: "${saleReceiptData.receiptNumber}"`);
    console.log(`  discountAmount: ${saleReceiptData.discountAmount}`);
    console.log(`  customerId: "${saleReceiptData.customerId}"`);
    console.log(`  salePerson: "${saleReceiptData.salePerson}"`);
    console.log('  lineItems: [');
    saleReceiptData.lineItems.forEach((item) => {
      console.log('    LineItemsDto {');
      console.log(`      description: "${item.description}"`);
      console.log(`      quantity: ${item.quantity}`);
      console.log(`      discountCap: ${item.discountCap}`);
      console.log(`      discountType: ${item.discountType}`);
      console.log(`      unitPrice: ${item.unitPrice}`);
      console.log(`      taxRate: ${item.taxRate}`);
      console.log(`      discountRate: ${item.discountRate}`);
      console.log(`      productId: "${item.productId}"`);
      console.log('    }');
    });
    console.log('  ]');
    console.log('}');

    // Save to context
    context?.setData((prevData: any) => ({
      ...prevData,
      saleReceipt: saleReceiptData,
    }));

    // Also log the raw data object if needed
    console.log('Raw Sale Receipt Data:', saleReceiptData);
  };

  // Debug logs
  console.log('Customer options:', customerOptions);
  console.log('Selected customer value:', customerName);
  console.log('Selected customer option:', selectedCustomer);

  return (
    <div className="max-w-5xl min-w-5xl px-2 overflow-y-auto css-dip3t8 ">
      <div className="flex min-w-[45rem] justify-between w-full mb-8">
        <h3 className="text-2xl ">Create Sales Recipt</h3>
      </div>
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
        <div className="">
          <Input
          label='Date'
            name="date"
            type={'date'}
            value={date}
            onchange={(e: any) => handleInputChange('date', e.target.value)}
           
          />
        </div>
      </div>

      <div className="mt-3 w-full flex">
        <div className="w-[50%] flex items-center space-x-3">
          <SearchSelect
          label='Customer'
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
          <div className="h-full mt-2 flex items-center">
            <button
              type="button"
              onClick={() => setIsAddCustomerDrawer(true)}
              className="flex items-center justify-center text-white bg-green-700 rounded-full size-10"
            >
              <i className="ri-add-line text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="my-5 pt-10">
        <DynamicTable />
      </div>
      <hr className="my-5" />
      <h3 className="text-lg font-thin my-2"> Payment Methods</h3>
      <div className="mt-2">
        <div className="grid grid-cols-2 gap-4">
          {['mtnMobileMoney', 'orangeMoney', 'other', 'bankTransfer'].map(
            (option) => (
              <div
                key={option}
                onClick={() => handlePaymentMethodClick(option)}
                className={`p-4 border cursor-pointer hover:border-green-500 hover:text-green-500 ${
                  selectedPaymentMethod === option
                    ? 'border-green-500 text-green-500'
                    : 'border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPaymentMethod === option}
                    onChange={() => handlePaymentMethodClick(option)}
                    className="mr-2 text-xl text-white accent-green-700"
                    name="paymentMethod"
                  />
                  <span>{option.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <hr className="my-5" />
      <h3 className="text-xl font-thin my-2">Notes</h3>
      <textarea
        value={note}
        onChange={(e) => handleInputChange('note', e.target.value)}
        className="h-36 border p-2 w-full outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      ></textarea>

      <div className="mt-5 w-full flex justify-end">
        <Button
          text={'Save Receipt'}
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
