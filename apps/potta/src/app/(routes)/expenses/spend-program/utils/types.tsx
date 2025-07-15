export type QuestionType =
  | 'text'
  | 'paragraph'
  | 'boolean'
  | 'number'
  | 'date'
  | 'link'
  | 'email'
  | 'single_select'
  | 'multi_select'
  | 'file_upload'
  | 'address'
  | 'contact'
  // Department fields
  | 'billing_contact'
  | 'billing_address'
  | 'net_payment_terms'
  | 'vendor_address'
  | 'vendor_contact'
  | 'promise_date'
  | 'shipping_date'
  | 'ship_to_address'
  | 'memo'
  | 'attachments'
  | 'vendor';

export interface FormQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  alwaysAsk?: boolean;
  mapping?: string;
  options?: string[]; // for select types
  // Add more type-specific fields as needed
}
