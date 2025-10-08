# Vendor KYC Verification Portal

This is a standalone portal for vendors to complete their KYC (Know Your Customer) verification process. The portal is accessible via a unique token link sent to vendors via email.

## Features

- ✅ **Token-based authentication** - No login required, vendors use a secure token from their email
- ✅ **Document upload** - Upload government ID, proof of address, and business registration documents
- ✅ **Drag & drop support** - Easy file upload with drag and drop functionality
- ✅ **File validation** - Automatic validation of file size and format
- ✅ **Real-time status updates** - See the status of each document and overall KYC verification
- ✅ **Error handling** - User-friendly error messages for upload failures
- ✅ **Responsive design** - Works on desktop, tablet, and mobile devices

## URL Structure

The KYC verification portal is accessible via:

```
https://app.potta.dev/vendor/kyc/verify?token={TOKEN}&vendorId={VENDOR_ID}&kycId={KYC_ID}
```

### URL Parameters

- `token`: Secure authentication token (encoded with vendor ID, KYC ID, and timestamp)
- `vendorId`: UUID of the vendor
- `kycId`: UUID of the KYC verification request

## Document Requirements

### Required Documents

1. **Government-issued ID**
   - Accepted: Passport, Driver's License, or National ID
   - Formats: JPG, PNG, PDF
   - Max size: 5MB

2. **Proof of Address**
   - Accepted: Utility bill, Bank statement, or official document
   - Formats: JPG, PNG, PDF
   - Max size: 5MB

### Optional Documents

3. **Business Registration** (if applicable)
   - Accepted: Business registration documents
   - Formats: JPG, PNG, PDF
   - Max size: 10MB

## API Endpoints

### Get KYC Verification Details
```http
GET /vendor/kyc/verify?token={TOKEN}&vendorId={VENDOR_ID}&kycId={KYC_ID}
```

**Response:**
```json
{
  "id": "uuid",
  "vendorId": "uuid",
  "status": "pending | in_review | approved | rejected",
  "documents": [
    {
      "id": "uuid",
      "type": "government_id | proof_of_address | business_registration",
      "status": "pending | uploaded | approved | rejected",
      "url": "string (optional)",
      "rejectionReason": "string (optional)",
      "uploadedAt": "ISO date (optional)"
    }
  ],
  "vendor": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "businessName": "string (optional)"
  },
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### Submit KYC Documents
```http
POST /vendor/kyc/submit
Content-Type: multipart/form-data

Body:
- token: string
- vendorId: string
- kycId: string
- documents[0][type]: string
- documents[0][file]: File
- documents[1][type]: string
- documents[1][file]: File
...
```

**Response:**
```json
{
  "id": "uuid",
  "status": "in_review",
  "submittedAt": "ISO date",
  ...
}
```

### Upload Individual Document
```http
POST /vendor/kyc/upload-document
Content-Type: multipart/form-data

Body:
- token: string
- vendorId: string
- kycId: string
- documentType: string
- file: File
```

**Response:**
```json
{
  "id": "uuid",
  "type": "government_id",
  "status": "uploaded",
  "url": "string",
  "uploadedAt": "ISO date"
}
```

### Get KYC Status
```http
GET /vendor/kyc/status?token={TOKEN}&vendorId={VENDOR_ID}&kycId={KYC_ID}
```

**Response:**
```json
{
  "status": "pending | in_review | approved | rejected",
  "documents": [...],
  "lastUpdated": "ISO date"
}
```

## File Structure

```
vendor/kyc/verify/
├── page.tsx                          # Main KYC verification page
├── components/
│   ├── KYCVerificationForm.tsx       # Main form component
│   └── DocumentUploader.tsx          # Document upload component
├── hooks/
│   ├── useKYCVerification.ts         # Fetch KYC data hook
│   ├── useKYCSubmission.ts           # Submit KYC hook
│   ├── useKYCDocumentUpload.ts       # Upload individual document hook
│   └── useKYCStatus.ts               # Check KYC status hook
├── services/
│   └── kycService.ts                 # API service functions
├── types/
│   └── index.ts                      # TypeScript type definitions
└── README.md                         # This file
```

## Component Usage

### KYCVerificationForm

Main form component that handles the entire KYC verification flow.

```tsx
<KYCVerificationForm 
  tokenData={{ token, vendorId, kycId }}
  kycData={kycData}
  onSuccess={() => refetch()}
/>
```

### DocumentUploader

Reusable document upload component with drag & drop support.

```tsx
<DocumentUploader
  documentType={documentType}
  onUpload={(file) => handleDocumentUpload(file)}
  onError={(error) => toast.error(error)}
  disabled={isUploading}
/>
```

## Custom Hooks

### useKYCVerification

Fetches KYC verification details.

```tsx
const { data, isLoading, error, refetch } = useKYCVerification({
  token,
  vendorId,
  kycId,
  enabled: true,
});
```

### useKYCSubmission

Handles KYC document submission.

```tsx
const { submitKYC, isSubmitting, error } = useKYCSubmission();

await submitKYC({
  token,
  vendorId,
  kycId,
  documents: [
    { type: 'government_id', file: File },
    { type: 'proof_of_address', file: File },
  ],
});
```

### useKYCDocumentUpload

Uploads individual documents.

```tsx
const { uploadDocument, isUploading, error } = useKYCDocumentUpload();

await uploadDocument({
  token,
  vendorId,
  kycId,
  documentType: 'government_id',
  file: File,
});
```

### useKYCStatus

Checks KYC verification status with optional polling.

```tsx
const { data, isLoading } = useKYCStatus({
  token,
  vendorId,
  kycId,
  enabled: true,
  refetchInterval: 30000, // Poll every 30 seconds
});
```

## Status Flow

```
pending → in_review → approved
                   ↘ rejected (can resubmit)
```

### Status Descriptions

- **pending**: Initial state, awaiting document upload
- **in_review**: Documents submitted and under review
- **approved**: KYC verification approved, vendor account activated
- **rejected**: KYC verification rejected, vendor can resubmit with corrected documents

## Error Handling

The portal includes comprehensive error handling:

- **413**: File size too large
- **415**: Unsupported file format
- **400**: Invalid request
- **401**: Expired or invalid token
- **404**: KYC verification not found
- **429**: Too many requests

## Security

- Token-based authentication (no password required)
- Secure file upload with validation
- HTTPS only
- Token expiration (included in token itself)
- Rate limiting on API endpoints

## Email Template Example

```
Subject: Action Required: Complete Your KYC Verification

Dear [Vendor Name],

To complete your vendor account setup and start receiving payments, you need to verify your identity through our KYC (Know Your Customer) process.

Please click the link below to complete your KYC verification:
https://app.potta.dev/vendor/kyc/verify?token={TOKEN}&vendorId={VENDOR_ID}&kycId={KYC_ID}

Required Documents:
- Government-issued ID (Passport, Driver's License, or National ID)
- Proof of address (Utility bill, Bank statement, etc.)
- Business registration documents (if applicable)

The verification process typically takes 1-2 business days once all documents are submitted.

If you have any questions or need assistance, please contact our support team.

Best regards,
The Potta Team
```

## Development

### Running Locally

```bash
npm run dev
```

### Testing

To test the KYC portal locally, you'll need:

1. A valid token (can be generated by the backend)
2. A vendor ID
3. A KYC ID

Example test URL:
```
http://localhost:4200/vendor/kyc/verify?token=TEST_TOKEN&vendorId=TEST_VENDOR_ID&kycId=TEST_KYC_ID
```

### Environment Variables

No additional environment variables are required. The portal uses the same axios configuration as the main application.

## Future Enhancements

- [ ] Add webcam capture for document photos
- [ ] Add OCR for automatic data extraction
- [ ] Add document preview before upload
- [ ] Add multi-language support
- [ ] Add progress indicator for file upload
- [ ] Add email notifications on status change
- [ ] Add document expiration date tracking

## Support

For technical support or questions, contact the development team or refer to the main Potta documentation.

