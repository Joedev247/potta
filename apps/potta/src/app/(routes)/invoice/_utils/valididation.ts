import * as yup from 'yup';

export const invoiceSchema = yup.object().shape({
  customerId: yup.string().uuid().required(),
  currency: yup.string().oneOf(['XAF']).required(),
  invoiceType: yup.string().oneOf(['Invoice']).required(),
  notes: yup.string().required(),
  paymentTerms: yup.string().required(),
  paymentMethod: yup.string().oneOf(['ACH Transfer']).required(),
  issuedDate: yup.date().required(),
  dueDate: yup.date().required(),
  invoiceTotal: yup.number().required(),
  invoiceNumber: yup.string().required(),
  taxRate: yup.number().required(),
  taxAmount: yup.number().required(),
  billingAddress: yup.string().required(),
  shippingAddress: yup.string().required(),
  status: yup.string().oneOf(['Overdue']).required(),
  paymentReference: yup.string().required(),
  lineItems: yup.array().of(yup.mixed().nullable()).required(),
});

export type IInvoicePayload = yup.InferType<typeof invoiceSchema>;

// Example usage:
// invoiceSchema.validate(invoiceObject).then(console.log).catch(console.error);
