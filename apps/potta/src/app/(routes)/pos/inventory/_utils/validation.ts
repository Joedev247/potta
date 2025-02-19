import * as yup from 'yup';

export const productSchema=yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  unitOfMeasure: yup.string().required(),
  cost: yup.number().required(),
  sku: yup.string().required(),
  inventoryLevel: yup.number().required(),
  salesPrice: yup.number().required(),
  taxable: yup.boolean().required(),
  taxRate: yup.number().required(),
  category: yup.string().required(),
  image: yup.string().required(),
})

export type IProductPayload = yup.InferType<typeof productSchema>;
