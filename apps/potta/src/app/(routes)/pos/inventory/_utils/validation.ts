import * as yup from 'yup';

export const productSchema=yup.object().shape({
  name: yup.string().required('name is required'),
  description: yup.string(),
  unitOfMeasure: yup.string(),
  cost: yup.number().required('cost is required').typeError("Must be a number"),
  sku: yup.string().required('sku is required'),
  inventoryLevel: yup.number(),
  salesPrice: yup.number().required('sales price is required'),
  taxable: yup.boolean().required(),
  taxRate: yup.number().typeError("Must be a number"),
  category: yup.string(),
  image: yup.string().default('https://static.nike.com/a/images/t_prod_ss/w_960,c_limit,f_auto/df31fd61-2df7-4c21-9326-94b45f799994/air-jordan-6-university-blue-ct8529-410-release-date.jpg'),
})

export const UpdateProductSchema=yup.object().shape({
  name: yup.string().required('name is required'),
  description: yup.string(),
  unitOfMeasure: yup.string(),
  cost: yup.number().required('cost is required').typeError("Must be a number"),
  sku: yup.string().required('sku is required'),
  inventoryLevel: yup.number(),
  salesPrice: yup.number().required('sales price is required'),
  taxable: yup.boolean().required(),
  taxRate: yup.number().typeError("Must be a number"),
  category: yup.string(),
  image: yup.string().default('https://static.nike.com/a/images/t_prod_ss/w_960,c_limit,f_auto/df31fd61-2df7-4c21-9326-94b45f799994/air-jordan-6-university-blue-ct8529-410-release-date.jpg'),
  status: yup.string().required('status is required'),
})

export type UpdateProductPayload = yup.InferType<typeof UpdateProductSchema>;
export type ProductPayload = yup.InferType<typeof productSchema>;
