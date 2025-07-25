import React, { useState, useEffect } from 'react';
import Input from '@potta/components/input';
import CurrencyInput from '@potta/components/currencyInput';
import Select from '@potta/components/select';
import Button from '@potta/components/button';
import CustomDatePicker from '@potta/components/customDatePicker';
import SearchableSelect from '@potta/components/searchableSelect';
import { CalendarDate } from '@internationalized/date';
import FileUpload from '@potta/components/fileUpload';
import { accountsApi } from '@potta/app/(routes)/accounting/utils/api';

const typeOptions = [
  { label: 'Out of Pocket', value: 'out_of_pocket' },
  { label: 'Mileage', value: 'mileage' },
];

const typeToCategory = {
  out_of_pocket: 'Out of Pocket',
  mileage: 'Mileage',
};

// Helper to convert Date to CalendarDate
function dateToCalendarDate(date: Date | undefined): CalendarDate | null {
  if (!date || isNaN(date.getTime())) return null;
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
}

const ReimbursementForm = ({
  onSubmit,
  onClose,
  initialData,
}: {
  onSubmit: (data: any) => void;
  onClose: () => void;
  initialData?: any;
}) => {
  const [form, setForm] = useState({
    madeBy: initialData?.madeBy || '',
    merchant: initialData?.merchant || '',
    amount: initialData?.amount || '',
    date: initialData?.date ? new Date(initialData.date) : undefined,
    memo: initialData?.memo || '',
    status: initialData?.status || 'pending',
    type: initialData?.type || 'out_of_pocket',
    account: initialData?.account || '',
    receiptFiles: initialData?.receiptFiles || [],
  });

  // Category is always derived from type
  const category =
    typeToCategory[form.type as keyof typeof typeToCategory] || '';

  // Fetch expense accounts
  const [accountOptions, setAccountOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  useEffect(() => {
    setAccountsLoading(true);
    setAccountsError(null);
    accountsApi
      .getByType('Expense')
      .then((data) => {
        // Assume data.data is the array of accounts
        const accounts = data.data || data;
        setAccountOptions(
          accounts.map((acc: any) => ({
            label: acc.name + (acc.code ? ` (${acc.code})` : ''),
            value: acc.uuid || acc.id || acc._id || acc.name,
          }))
        );
      })
      .catch((err) => {
        setAccountsError('Failed to load accounts');
      })
      .finally(() => setAccountsLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as any;
    setForm({ ...form, [name]: value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleDateChange = (calendarDate: CalendarDate | null) => {
    if (calendarDate) {
      setForm({
        ...form,
        date: new Date(
          calendarDate.year,
          calendarDate.month - 1,
          calendarDate.day
        ),
      });
    } else {
      setForm({ ...form, date: undefined });
    }
  };

  const handleFileChange = (files: File[]) => {
    setForm({ ...form, receiptFiles: files });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...form, category });
    onClose();
    setForm({
      madeBy: '',
      merchant: '',
      amount: '',
      date: undefined,
      memo: '',
      status: 'pending',
      type: 'out_of_pocket',
      account: '',
      receiptFiles: [],
    });
  };

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <Input
          name="madeBy"
          label="Employee"
          value={form.madeBy}
          onchange={handleChange}
          placeholder="Employee Name"
          required
          type="text"
        />
        <Select
          label="Type"
          options={typeOptions}
          selectedValue={form.type}
          onChange={(val: string) => handleSelect('type', val)}
          bg=""
        />
        {form.type === 'out_of_pocket' && (
          <Input
            name="merchant"
            label="Merchant"
            value={form.merchant}
            onchange={handleChange}
            placeholder="Merchant"
            required
            type="text"
          />
        )}
        <CurrencyInput
          label="Amount"
          value={form.amount}
          onChange={(e) => handleSelect('amount', e.target.value)}
          placeholder="Amount"
          required
        />
        <CustomDatePicker
          label="Date"
          placeholder="Pick a date"
          value={dateToCalendarDate(form.date)}
          onChange={handleDateChange}
          isRequired
        />
      </div>
      <div className="flex flex-col gap-4">
        <Input
          name="memo"
          label="Memo"
          value={form.memo}
          onchange={handleChange}
          placeholder="Memo"
          type="text"
        />
        <Input
          name="status"
          label="Status"
          value={form.status}
          onchange={handleChange}
          placeholder="Status"
          type="text"
          disabled
        />
        <Input
          name="category"
          label="Category"
          value={category}
          onchange={() => {}}
          placeholder="Category"
          type="text"
          disabled
        />
        <SearchableSelect
          label="Select Account"
          options={accountOptions}
          selectedValue={form.account}
          onChange={(val: string) => handleSelect('account', val)}
          loading={accountsLoading}
          disabled={accountsLoading}
          placeholder={
            accountsLoading
              ? 'Loading accounts...'
              : accountsError || 'Select account'
          }
        />
        <FileUpload
          files={form.receiptFiles}
          setFiles={handleFileChange}
          label="Upload Receipt"
        />
      </div>
      <div className="col-span-1 md:col-span-2 flex gap-4 mt-6 justify-end">
        <Button type="submit" text="Submit" theme="default" className='h-fit' />
      </div>
    </form>
  );
};

export default ReimbursementForm;
