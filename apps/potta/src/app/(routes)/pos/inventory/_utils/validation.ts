import * as yup from 'yup';

export const productSchema=yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  unitOfMeasure: yup.string().required(),
  cost: yup.number().required(),
  sku: yup.string().required(),
  inventoryLevel: yup.number(),
  salesPrice: yup.number().required(),
  taxable: yup.boolean().required(),
  taxRate: yup.number(),
  category: yup.string(),
  image: yup.string(),
})

export type IProductPayload = yup.InferType<typeof productSchema>;
