'use client'; // For Next.js 13+ App Directory
import Input from '@potta/components/input';
import Select from '@potta/components/select';
import { useContext, useState, useEffect } from 'react';
import DynamicTable from './newtableInvoice';
import Button from '@potta/components/button';
import { ContextData } from '@potta/components/context';
import { Icon } from '@iconify/react';
import useGetAllCustomers from '@potta/app/(routes)/customers/_hooks/usegetAllCustomers';
import CustomInput from '../../components/CustomInput';
import { form } from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IInvoicePayload, invoiceSchema } from '../../_utils/valididation';
import useCreateInvoice from '../../_hooks/useCreateInvoice';
import { v4 } from 'uuid';

const Left = () => {
  const context = useContext(ContextData);
  const [selectedOptions, setSelectedOptions] = useState<any>({
    mtnMobileMoney: false,
    orangeMoney: false,
    airtime: false,
    bankTransfer: false,
  });

  const [date, setDate] = useState('');
  const [invoice, setInvoice] = useState('Invoice');
  const [customerName, setCustomerName] = useState('ABC Customer');
  const [invoiceNumber, setInvoiceNumber] = useState('0025');
  const [currency, setCurrency] = useState('USD ($)');
  const [note, setNote] = useState('');

  const {
    data: CutomersData,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    refetch,
  } = useGetAllCustomers({ limit: 10, page: 1 });

  console.log({ CutomersData });
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

  const { data, isLoading: loadingCustomers } = useGetAllCustomers({
    limit: 100,
    page: 1,
  });

  console.log({ customers: data });

  const { mutate: createMutate, isPending: pendingMutate } = useCreateInvoice(
    v4()
  );
  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(invoiceSchema),
  });

  const onSubmit: SubmitHandler<IInvoicePayload> = (inputs) => {
    console.log(inputs);
    // createMutate(inputs);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="max-h-[90vh] overflow-y-auto ">
        <div className="grid w-full grid-cols-4 gap-4">
          <Select
            options={[
              { label: 'USD ($)', value: 'USD ($)' },
              { label: 'EUR (€)', value: 'EUR (€)' },
              { label: 'GBP (£)', value: 'GBP (£)' },
            ]}
            selectedValue={currency}
            onChange={(value: any) => handleInputChange('currency', value)}
            bg={''}
          />
          <Select
            options={[
              { label: 'Invoice', value: 'Invoice' },
              { label: 'Receipt', value: 'Receipt' },
            ]}
            selectedValue={invoice}
            onChange={(value: any) => handleInputChange('invoice', value)}
            bg={''}
          />
          <Input
            type={'date'}
            value={date}
            name="invoiceNumber"
            register={form.register}
            errors={form.formState.errors.invoiceNumber}
            onChange={(e) => handleInputChange('date', e.target.value)}
          />
          <Input
            type="text"
            value={invoiceNumber}
            onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
          />
        </div>

        <div className="flex items-center w-full gap-3 mt-3">
          <div className="w-[50%]">
            <Select
              options={[
                { label: 'ABC Customer', value: 'ABC Customer' },
                { label: 'XYZ Customer', value: 'XYZ Customer' },
              ]}
              selectedValue={customerName}
              onChange={(value: any) =>
                handleInputChange('customerName', value)
              }
              bg={''}
            />
          </div>
          <button
            type="button"
            className="flex items-center justify-center text-white bg-green-700 rounded-full size-8"
          >
            <Icon icon="material-symbols:add" width="24" height="24" />
          </button>
        </div>

        <div className="flex flex-col gap-2 pt-10 my-5 min-h-[40vh]">
          {/* <DynamicTable /> */}
          <div className="flex items-center py-2 font-semibold bg-[#F2F2F2]">
            <p className="w-3/6 px-2">ID</p>
            <p className="w-1/6 px-2">Qty</p>
            <p className="w-1/6 px-2">Price</p>
            <p className="w-1/6 px-2">Tax</p>
          </div>
          <div className="flex items-center gap-2">
            <Input className="w-3/6" placeholder="Dell Inspiron DMX Laptops" />
            <Input className="w-1/6" placeholder="1000" type="number" />
            <Input className="w-1/6" placeholder="2000" type="number" />
            <Input className="w-1/6" placeholder="3000" type="number" />
          </div>
        </div>

        <hr className="my-5" />
        <h3 className="my-2 text-xl font-thin">Invoice Payment Methods</h3>
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
                    <span>
                      {option.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <hr className="my-5" />
        <h3 className="my-2 text-xl font-thin">Notes</h3>
        <textarea
          value={note}
          onChange={(e) => handleInputChange('note', e.target.value)}
          className="w-full p-2 border outline-none h-36"
        />

        <div className="flex justify-end w-full mt-5">
          <Button
            text={'Save Invoice'}
            onClick={handleSaveInvoice}
            type={'button'}
          />
        </div>
      </div>
    </form>
  );
};

export default Left;
