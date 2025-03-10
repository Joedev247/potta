import * as yup from "yup";

const addressSchema = yup.object().shape({
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string(),
  country: yup.string().required("Country is required"),
  postalCode: yup.string(),
  latitude: yup.number().typeError("Must be a number"),
  longitude: yup.number().typeError("Must be a number")


})
const VendorStatusEnum = [ 'pending', 'schedule', 'complete', 'enabled', 'disabled', 'available', 'expired', 'taken' ] as const
const VendorTypeEnum = ["individual", "company",] as const;
const VendorCurrencyEnum = ["EUR", "USD", "XAF"] as const;
const VendorClassificationEnum = ["Supplier", "Service Provider"] as const;
const URL = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm
const phoneNumberRegex = /^\+\d{1,4}\s?\d{6,14}$/

export const vendorSchema = yup.object().shape({
  name: yup.string().required("Vendor name is required"),
  type: yup.string().oneOf([...VendorTypeEnum], "Invalid type").required("Type is required"),
  contactPerson: yup.string(),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required").matches(phoneNumberRegex, "Invalid phone number. Example: +237689393939"),
  address: addressSchema,
  taxID: yup.string(),
  paymentTerms: yup.string(),
  paymentMethod: yup.string(),
  website: yup.string(),
  accountDetails: yup.string(),
  currency: yup.string().oneOf([...VendorCurrencyEnum], "currency").required("Currency is required"),
  openingBalance: yup.number().typeError("Must be a number"),
  classification: yup.string().oneOf([...VendorClassificationEnum], "Invalid Classification").required("Classification is required"),
  notes: yup.string(),

})

export const updateVendorSchema = yup.object().shape({
  name: yup.string().required("Vendor name is required"),
  type: yup.string().oneOf([...VendorTypeEnum], "Invalid type").required("Type is required"),
  contactPerson: yup.string().required("Contact person is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required").matches(phoneNumberRegex, "Invalid phone number. Example: +237689393939"),
  address: addressSchema,
  taxID: yup.string().nullable(),
  paymentTerms: yup.string().nullable(),
  paymentMethod: yup.string().nullable(),
  website: yup.string().nullable(),
  accountDetails: yup.string().nullable(),
  currency: yup.string().oneOf([...VendorCurrencyEnum], "currency").required("Currency is required"),
  openingBalance: yup.number().typeError("Must be a number"),
  classification: yup.string().oneOf([...VendorClassificationEnum], "Invalid Classification").required("Classification is required"),
  notes: yup.string().nullable(),
  status: yup.string().oneOf([...VendorStatusEnum], "Invalid Status").required("Status is required"),
})

export type UpdateVendorPayload = yup.InferType<typeof updateVendorSchema>;
export type VendorPayload = yup.InferType<typeof vendorSchema>;
