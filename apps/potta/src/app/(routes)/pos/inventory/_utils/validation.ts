import * as yup from 'yup';

export const productSchema=yup.object().shape({
  name: yup.string().required('name is required'),
  description: yup.string(),
  unitOfMeasure: yup.string().required('unit of measurement is required'),
  cost: yup.number().required('cost is required').typeError("Must be a number"),
  sku: yup.string().required('sku is required'),
  inventoryLevel: yup.number(),
  salesPrice: yup.number().required('sales price is required'),
  taxable: yup.boolean().required(),
  taxRate: yup.number().typeError("Must be a number"),
  category: yup.string(),
  image: yup.string(),
})

export const UpdateProductSchema=yup.object().shape({
  name: yup.string().required('name is required'),
  description: yup.string(),
  unitOfMeasure: yup.string().required('unit of measurement is required'),
  cost: yup.number().required('cost is required').typeError("Must be a number"),
  sku: yup.string().required('sku is required'),
  inventoryLevel: yup.number(),
  salesPrice: yup.number().required('sales price is required'),
  taxable: yup.boolean().required(),
  taxRate: yup.number().typeError("Must be a number"),
  category: yup.string(),
  image: yup.string(),
  status: yup.string().required('status is required'),
})

export type UpdateProductPayload = yup.InferType<typeof UpdateProductSchema>;
export type ProductPayload = yup.InferType<typeof productSchema>;
