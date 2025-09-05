'use client';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CreatePaymentMethodPayload, PaymentMethodType } from '../utils/types';
import Input from '@potta/components/input';
import Select from '@potta/components/select';
import Button from '@potta/components/button';
import Modal from '@potta/components/modal';

interface PaymentMethodFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePaymentMethodPayload) => void;
  initialData?: CreatePaymentMethodPayload;
  isEditing?: boolean;
}

const paymentMethodSchema = yup.object().shape({
  paymentMethodType: yup
    .string()
    .oneOf(
      [
        'BANK_TRANSFER',
        'MOBILE_MONEY',
        'CREDIT_CARD',
        'DEBIT_CARD',
        'CASH',
        'CRYPTOCURRENCY',
        'OTHER',
      ],
      'Invalid payment method type'
    )
    .required('Payment method type is required'),
  accountName: yup.string().required('Account name is required'),
  accountNumber: yup.string().when('paymentMethodType', {
    is: (val: string) =>
      ['BANK_TRANSFER', 'DEBIT_CARD', 'CREDIT_CARD'].includes(val),
    then: (schema) =>
      schema.required('Account number is required for this payment type'),
    otherwise: (schema) => schema.nullable(),
  }),
  bankName: yup.string().when('paymentMethodType', {
    is: 'BANK_TRANSFER',
    then: (schema) =>
      schema.required('Bank name is required for bank transfers'),
    otherwise: (schema) => schema.nullable(),
  }),
  phoneNumber: yup.string().when('paymentMethodType', {
    is: 'MOBILE_MONEY',
    then: (schema) =>
      schema.required('Phone number is required for mobile money'),
    otherwise: (schema) => schema.nullable(),
  }),
  dailyLimit: yup
    .number()
    .typeError('Must be a number')
    .min(0, 'Daily limit must be positive'),
  monthlyLimit: yup
    .number()
    .typeError('Must be a number')
    .min(0, 'Monthly limit must be positive'),
  isPrimary: yup.boolean().default(false),
  isActive: yup.boolean().default(true),
  notes: yup.string().nullable(),
});

const PaymentMethodTypeEnum = [
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'MOBILE_MONEY', label: 'Mobile Money' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'CASH', label: 'Cash' },
  { value: 'CRYPTOCURRENCY', label: 'Cryptocurrency' },
  { value: 'OTHER', label: 'Other' },
];

const CardTypeEnum = [
  { value: 'VISA', label: 'Visa' },
  { value: 'MASTERCARD', label: 'Mastercard' },
  { value: 'AMEX', label: 'American Express' },
  { value: 'DISCOVER', label: 'Discover' },
  { value: 'OTHER', label: 'Other' },
];

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [selectedType, setSelectedType] =
    useState<PaymentMethodType>('BANK_TRANSFER');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreatePaymentMethodPayload>({
    resolver: yupResolver(paymentMethodSchema),
    defaultValues: {
      paymentMethodType: 'BANK_TRANSFER',
      accountName: '',
      accountNumber: '',
      bankName: '',
      bankCode: '',
      swiftCode: '',
      iban: '',
      phoneNumber: '',
      walletId: '',
      cardNumber: '',
      cardType: '',
      dailyLimit: 0,
      monthlyLimit: 0,
      isPrimary: false,
      isActive: true,
      notes: '',
    },
  });

  const watchedType = watch('paymentMethodType');

  useEffect(() => {
    if (watchedType) {
      setSelectedType(watchedType as PaymentMethodType);
    }
  }, [watchedType]);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setSelectedType(initialData.paymentMethodType);
    } else {
      reset({
        paymentMethodType: 'BANK_TRANSFER',
        accountName: '',
        accountNumber: '',
        bankName: '',
        bankCode: '',
        swiftCode: '',
        iban: '',
        phoneNumber: '',
        walletId: '',
        cardNumber: '',
        cardType: '',
        dailyLimit: 0,
        monthlyLimit: 0,
        isPrimary: false,
        isActive: true,
        notes: '',
      });
      setSelectedType('BANK_TRANSFER');
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: CreatePaymentMethodPayload) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const renderTypeSpecificFields = () => {
    switch (selectedType) {
      case 'BANK_TRANSFER':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Account Number"
                type="text"
                name="accountNumber"
                placeholder="Enter account number"
                register={register}
                errors={errors.accountNumber}
                required
              />
              <Input
                label="Bank Name"
                type="text"
                name="bankName"
                placeholder="Enter bank name"
                register={register}
                errors={errors.bankName}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Bank Code"
                type="text"
                name="bankCode"
                placeholder="Enter bank code"
                register={register}
                errors={errors.bankCode}
              />
              <Input
                label="SWIFT Code"
                type="text"
                name="swiftCode"
                placeholder="Enter SWIFT code"
                register={register}
                errors={errors.swiftCode}
              />
            </div>
            <Input
              label="IBAN"
              type="text"
              name="iban"
              placeholder="Enter IBAN"
              register={register}
              errors={errors.iban}
            />
          </>
        );

      case 'MOBILE_MONEY':
        return (
          <Input
            label="Phone Number"
            type="tel"
            name="phoneNumber"
            placeholder="+237 123 456 789"
            register={register}
            errors={errors.phoneNumber}
            required
          />
        );

      case 'CREDIT_CARD':
      case 'DEBIT_CARD':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Card Number"
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                register={register}
                errors={errors.cardNumber}
                required
              />
              <Controller
                name="cardType"
                control={control}
                render={({ field }) => (
                  <Select
                    options={CardTypeEnum}
                    selectedValue={field.value}
                    onChange={field.onChange}
                    bg="bg-white"
                    name="Select Card Type"
                    label="Card Type"
                  />
                )}
              />
            </div>
          </>
        );

      case 'CRYPTOCURRENCY':
        return (
          <Input
            label="Wallet ID"
            type="text"
            name="walletId"
            placeholder="Enter wallet ID"
            register={register}
            errors={errors.walletId}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Payment Method' : 'Add Payment Method'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="paymentMethodType"
            control={control}
            render={({ field }) => (
              <Select
                options={PaymentMethodTypeEnum}
                selectedValue={field.value}
                onChange={field.onChange}
                bg="bg-white"
                name="Select Payment Method Type"
                label="Payment Method Type"
                required
              />
            )}
          />
          <Input
            label="Account Name"
            type="text"
            name="accountName"
            placeholder="Enter account name"
            register={register}
            errors={errors.accountName}
            required
          />
        </div>

        {renderTypeSpecificFields()}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Daily Limit"
            type="number"
            name="dailyLimit"
            placeholder="0"
            register={register}
            errors={errors.dailyLimit}
          />
          <Input
            label="Monthly Limit"
            type="number"
            name="monthlyLimit"
            placeholder="0"
            register={register}
            errors={errors.monthlyLimit}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPrimary"
              {...register('isPrimary')}
              className="rounded border-gray-300"
            />
            <label
              htmlFor="isPrimary"
              className="text-sm font-medium text-gray-700"
            >
              Set as Primary Payment Method
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="rounded border-gray-300"
              defaultChecked
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Mark as Active
            </label>
          </div>
        </div>

        <Input
          label="Notes"
          type="text"
          name="notes"
          placeholder="Additional notes (optional)"
          register={register}
          errors={errors.notes}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            text="Cancel"
            theme="lightBlue"
            onClick={handleClose}
          />
          <Button
            type="submit"
            text={isEditing ? 'Update Payment Method' : 'Add Payment Method'}
            theme="default"
          />
        </div>
      </form>
    </Modal>
  );
};

export default PaymentMethodForm;
