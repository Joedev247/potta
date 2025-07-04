import * as yup from 'yup';

export const productSchema = yup.object().shape({
  name: yup.string().required('name is required'),
  description: yup.string(),
  unitOfMeasure: yup.string(),
  cost: yup.number().required('cost is required').typeError('Must be a number'),
  sku: yup.string().required('sku is required'),
  inventoryLevel: yup.number(),
  salesPrice: yup.number().required('sales price is required'),
  taxable: yup.boolean().required(),
  categoryId: yup.string(),
  images: yup.array().of(yup.string()).default([]),
});

export const UpdateProductSchema = yup.object().shape({
  name: yup.string().required('name is required'),
  description: yup.string(),
  unitOfMeasure: yup.string(),
  cost: yup.number().required('cost is required').typeError('Must be a number'),
  sku: yup.string().required('sku is required'),
  inventoryLevel: yup.number(),
  salesPrice: yup.number().required('sales price is required'),
  taxable: yup.boolean().required(),
  categoryId: yup.string(),
  images: yup.array().of(yup.string()).default([]),
  status: yup.string().required('status is required'),
});

export const productCategorySchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().default(''),
});

export type UpdateProductPayload = yup.InferType<typeof UpdateProductSchema>;
export type ProductPayload = yup.InferType<typeof productSchema>;
export type ProductCategoryPayload = yup.InferType<
  typeof productCategorySchema
>;
