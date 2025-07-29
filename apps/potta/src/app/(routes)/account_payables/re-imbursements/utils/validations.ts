import * as yup from 'yup';


export const reimbursementSchema = yup.object({
  madeBy: yup.array().min(1, 'Please select at least one employee').required('Employee is required'),
  merchant: yup.string().when('type', {
    is: 'out_of_pocket',
    then: (schema) => schema.required('Merchant is required for out of pocket expenses'),
    otherwise: (schema) => schema.optional(),
  }),
  amount: yup
    .number()
    .positive('Amount must be positive')
    .required('Amount is required')
    .min(1, 'Amount must be at least 1'),
  date: yup.date().required('Date is required'),
  memo: yup.string().max(500, 'Memo cannot exceed 500 characters'),
  status: yup.string().required('Status is required'),
  type: yup.string().required('Type is required'),
  account: yup.string().required('Account is required'),
  receiptFiles: yup.array().optional(),
});