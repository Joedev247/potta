'use client'; // For Next.js 13+ App Directory
import Input from '@potta/components/input';
import SearchSelect from '@potta/components/search-select';
import { useContext, useState, useEffect } from 'react';
import DynamicTable from './newtableInvoice';
import Button from '@potta/components/button';
import { ContextData } from '@potta/components/context';
import useGetAllCustomers from '@potta/app/(routes)/pos/customers/hooks/useGetAllCustomers';
import SliderCustomer from '@potta/app/(routes)/pos/customers/components/customerSlider';
import Select from '@potta/components/select';
import { Customer } from '../../../customers/utils/types';


const Left = () => {
  const context = useContext(ContextData);
  const [selectedOptions, setSelectedOptions] = useState<any>({
    mtnMobileMoney: false,
    orangeMoney: false,
    airtime: false,
    bankTransfer: false,
  });
  const { data: customers, isLoading: customersLoading } = useGetAllCustomers({
    page: 1,
    limit: 100
  }) as { data: Customer[] | undefined; isLoading: boolean };
console.log(customers)
  const [date, setDate] = useState('');
  const [invoice, setInvoice] = useState('Invoice');
  const [customerName, setCustomerName] = useState('ABC Customer');
  const [invoiceNumber, setInvoiceNumber] = useState('0025');
  const [currency, setCurrency] = useState('USD');
  const [note, setNote] = useState('');
  const [isAddCustomerDrawer, setIsAddCustomerDrawer] = useState(false);

  const customerOptions = customers?.map((customer: Customer) => ({
    label: customer.firstName,
    value: customer.uuid,
  })) || [];

  const handleInputChange = (key: string, value: any) => {
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
    setSelectedOptions((prevState: any) => {
      const updatedSelectedOptions = {
        ...prevState,
        [option]: !prevState[option],
      };

      // Update context data
      context?.setData((prevData: any) => ({
        ...prevData,
        payment_method: Object.keys(updatedSelectedOptions).filter(
          (key) => updatedSelectedOptions[key]
        ),
      }));

      return updatedSelectedOptions;
    });
  };

  const handleSaveInvoice = () => {
    const formData = {
      date,
      payment_method: Object.keys(selectedOptions).filter(
        (key) => selectedOptions[key]
      ),
      note,
      customer_name: customerName,
      invoice: invoice,
      table: context?.data?.table || [],
      number: invoiceNumber,
      currency,
    };

    // Save to context
    context?.setData((prevData: any) => ({
      ...prevData,
      ...formData,
    }));

    // Log context data
    console.log('Context Data:', context?.data);
  };

  return (
    <div className="">
      <div className="w-full grid grid-cols-4 gap-4">
        <div>
          <Select
            options={[
              { label: 'USD', value: 'USD' },
              { label: 'EUR', value: 'EUR' },
              { label: 'GBP', value: 'GBP' },
              { label: 'FCFA', value: 'FCFA' },
            ]}
            selectedValue={currency}
            onChange={(value: any) => handleInputChange('currency', value)}
            bg={''}
          />
        </div>
        <div className="">
          <Input
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
            options={customerOptions}
            value={customerOptions.find(opt => opt.value === customerName)}
            onChange={(option: any) => handleInputChange('customerName', option?.value)}
            isLoading={customersLoading}
            placeholder="Select a customer..."
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
      <h3 className="text-xl font-thin my-2"> Payment Methods</h3>
      <div className="mt-2">
        <div className="grid grid-cols-2 gap-4">
          {['mtnMobileMoney', 'orangeMoney', 'airtime', 'bankTransfer'].map(
            (option) => (
              <div
                key={option}
                onClick={() => handlePaymentMethodClick(option)}
                className={`p-4 border cursor-pointer ${
                  selectedOptions[option]
                    ? 'border-green-500 text-green-500'
                    : 'border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedOptions[option]}
                    onChange={() => handlePaymentMethodClick(option)}
                    className="mr-2 text-xl"
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
      <SliderCustomer  open={isAddCustomerDrawer} setOpen={setIsAddCustomerDrawer}/>
    </div>
  );
};

export default Left;
