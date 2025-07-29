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
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { reimbursementSchema } from '../utils/validations';

const typeOptions = [
  { label: 'Out of Pocket', value: 'out_of_pocket' },
  { label: 'Mileage', value: 'mileage' },
];

const typeToCategory = {
  out_of_pocket: 'Out of Pocket',
  mileage: 'Mileage',
};

// Yup validation schema

type ReimbursementFormData = yup.InferType<typeof reimbursementSchema>;

// Helper to convert Date to CalendarDate
function dateToCalendarDate(date: Date | undefined): CalendarDate | null {
  if (!date || isNaN(date.getTime())) return null;
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
}

// Mock employee data - replace with actual API call
const employeeOptions = [
  { label: 'John Doe', value: 'john-doe' },
  { label: 'Jane Smith', value: 'jane-smith' },
  { label: 'Mike Johnson', value: 'mike-johnson' },
  { label: 'Sarah Wilson', value: 'sarah-wilson' },
  { label: 'David Brown', value: 'david-brown' },
];

const ReimbursementForm = ({
  onSubmit,
  onClose,
  initialData,
}: {
  onSubmit: (data: any) => void;
  onClose: () => void;
  initialData?: any;
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ReimbursementFormData>({
    resolver: yupResolver(reimbursementSchema),
    defaultValues: {
      madeBy: initialData?.madeBy ? [initialData.madeBy] : [],
      merchant: initialData?.merchant || '',
      amount: initialData?.amount || '',
      date: initialData?.date ? new Date(initialData.date) : undefined,
      memo: initialData?.memo || '',
      status: initialData?.status || 'pending',
      type: initialData?.type || 'out_of_pocket',
      account: initialData?.account || '',
      receiptFiles: initialData?.receiptFiles || [],
    },
  });

  const watchedType = watch('type');

  // Category is always derived from type
  const category =
    typeToCategory[watchedType as keyof typeof typeToCategory] || '';

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

  const handleDateChange = (calendarDate: CalendarDate | null) => {
    if (calendarDate) {
      setValue(
        'date',
        new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day)
      );
    } else {
      setValue('date', undefined);
    }
  };

  const handleFileChange = (files: File[]) => {
    setValue('receiptFiles', files);
  };

  const onFormSubmit = (data: ReimbursementFormData) => {
    onSubmit({ ...data, category });
    onClose();
    reset();
  };

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 mb-10 gap-6 w-full max-w-5xl"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <div className="flex flex-col gap-4">
        <Controller
          name="madeBy"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              label="Employee"
              options={employeeOptions}
              selectedValue={field.value}
              onChange={(val: string[]) => field.onChange(val)}
              multiple={true}
              placeholder="Select employee(s)"
              error={errors.madeBy?.message}
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              label="Type"
              options={typeOptions}
              selectedValue={field.value}
              onChange={(val: string) => field.onChange(val)}
              bg=""
              error={errors.type?.message}
            />
          )}
        />

        {watchedType === 'out_of_pocket' && (
          <Controller
            name="merchant"
            control={control}
            render={({ field }) => (
              <Input
                name="merchant"
                label="Merchant"
                value={field.value}
                onchange={(e) => field.onChange(e.target.value)}
                placeholder="Merchant"
                required
                type="text"
                errors={errors.merchant?.message}
              />
            )}
          />
        )}

        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <CurrencyInput
              label="Amount"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder="Amount"
              required
              error={errors.amount?.message}
            />
          )}
        />

        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <CustomDatePicker
              label="Date"
              placeholder="Pick a date"
              value={dateToCalendarDate(field.value)}
              onChange={handleDateChange}
              isRequired
              errors={errors.date?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Controller
          name="memo"
          control={control}
          render={({ field }) => (
            <Input
              name="memo"
              label="Memo"
              value={field.value}
              onchange={(e) => field.onChange(e.target.value)}
              placeholder="Memo"
              type="text"
              errors={errors.memo?.message}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Input
              name="status"
              label="Status"
              value={field.value}
              onchange={(e) => field.onChange(e.target.value)}
              placeholder="Status"
              type="text"
              disabled
              errors={errors.status?.message}
            />
          )}
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

        <Controller
          name="account"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              label="Select Account"
              options={accountOptions}
              selectedValue={field.value}
              onChange={(val: string) => field.onChange(val)}
              isLoading={accountsLoading}
              disabled={accountsLoading}
              placeholder={
                accountsLoading
                  ? 'Loading accounts...'
                  : accountsError || 'Select account'
              }
              error={errors.account?.message}
            />
          )}
        />

        <Controller
          name="receiptFiles"
          control={control}
          render={({ field }) => (
            <FileUpload
              files={field.value}
              setFiles={handleFileChange}
              label="Upload Receipt"
            />
          )}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-2 bg-white border-t border-gray-200 flex justify-end space-x-3">
        <Button
          type="submit"
          className="!py-3 !px-6"
          text="Submit"
          theme="default"
        />
      </div>
    </form>
  );
};

export default ReimbursementForm;
