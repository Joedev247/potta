'use client';
import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Camera,
  FileImage,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useKYCSubmission } from '../hooks';
import DocumentUploader from './DocumentUploader';
// import DocumentUploader from './DocumentUploader';
// import { useKYCSubmission } from '../hooks/useKYCSubmission';
// 
interface KYCTokenData {
  token: string;
  vendorId: string;
  kycId: string;
}

interface KYCData {
  id: string;
  vendorId: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  documents: Array<{
    id: string;
    type: string;
    status: 'pending' | 'uploaded' | 'approved' | 'rejected';
    url?: string;
    rejectionReason?: string;
  }>;
  vendor: {
    id: string;
    name: string;
    email: string;
    businessName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface KYCVerificationFormProps {
  tokenData: KYCTokenData;
  kycData: KYCData;
  onSuccess: () => void;
}

interface DocumentType {
  id: string;
  type: string;
  label: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
  maxSize: number; // in MB
}

const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'government_id',
    type: 'government_id',
    label: 'Government-issued ID',
    description: "Passport, Driver's License, or National ID",
    required: true,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 5,
  },
  {
    id: 'proof_of_address',
    type: 'proof_of_address',
    label: 'Proof of Address',
    description: 'Utility bill, Bank statement, or other official document',
    required: true,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 5,
  },
  {
    id: 'business_registration',
    type: 'business_registration',
    label: 'Business Registration',
    description: 'Business registration documents (if applicable)',
    required: false,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 10,
  },
];

const KYCVerificationForm: React.FC<KYCVerificationFormProps> = ({
  tokenData,
  kycData,
  onSuccess,
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<
    Record<string, File>
  >({});
  const [uploadStatuses, setUploadStatuses] = useState<
    Record<string, 'idle' | 'uploading' | 'success' | 'error'>
  >({});

  const { submitKYC, isSubmitting } = useKYCSubmission();

  const handleDocumentUpload = (documentType: string, file: File) => {
    setUploadedDocuments((prev) => ({
      ...prev,
      [documentType]: file,
    }));
    setUploadStatuses((prev) => ({
      ...prev,
      [documentType]: 'success',
    }));
    toast.success(`${file.name} uploaded successfully`);
  };

  const handleDocumentRemove = (documentType: string) => {
    setUploadedDocuments((prev) => {
      const newDocs = { ...prev };
      delete newDocs[documentType];
      return newDocs;
    });
    setUploadStatuses((prev) => ({
      ...prev,
      [documentType]: 'idle',
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required documents
      const requiredDocuments = DOCUMENT_TYPES.filter((doc) => doc.required);
      const missingDocuments = requiredDocuments.filter(
        (doc) => !uploadedDocuments[doc.type]
      );

      if (missingDocuments.length > 0) {
        toast.error(
          `Please upload required documents: ${missingDocuments
            .map((d) => d.label)
            .join(', ')}`
        );
        return;
      }

      // Submit KYC verification
      await submitKYC({
        token: tokenData.token,
        vendorId: tokenData.vendorId,
        kycId: tokenData.kycId,
        documents: Object.entries(uploadedDocuments).map(([type, file]) => ({
          type,
          file,
        })),
      });

      toast.success('KYC verification submitted successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error submitting KYC verification:', error);
      toast.error('Failed to submit KYC verification. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'in_review':
        return <FileText className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'in_review':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isFormValid = () => {
    const requiredDocuments = DOCUMENT_TYPES.filter((doc) => doc.required);
    return requiredDocuments.every((doc) => uploadedDocuments[doc.type]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              KYC Verification
            </h1>
            <p className="text-gray-600 mt-1">
              Complete your identity verification to activate your vendor
              account
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
              kycData.status
            )}`}
          >
            {getStatusIcon(kycData.status)}
            <span className="ml-2 capitalize">
              {kycData.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Verification for:</h3>
          <div className="text-blue-800">
            <p>
              <strong>Vendor:</strong> {kycData.vendor.name}
            </p>
            <p>
              <strong>Email:</strong> {kycData.vendor.email}
            </p>
            {kycData.vendor.businessName && (
              <p>
                <strong>Business:</strong> {kycData.vendor.businessName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Required Documents
        </h2>
        <div className="grid gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">1</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Government-issued ID
              </h3>
              <p className="text-gray-600 text-sm">
                Upload a clear photo or scan of your passport, driver's license,
                or national ID card.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">2</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Proof of Address</h3>
              <p className="text-gray-600 text-sm">
                Provide a utility bill, bank statement, or other official
                document showing your address.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">3</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Business Registration (Optional)
              </h3>
              <p className="text-gray-600 text-sm">
                If you're a business, upload your business registration
                documents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upload Documents
        </h2>

        <div className="space-y-6">
          {DOCUMENT_TYPES.map((docType) => {
            const existingDocument = kycData.documents.find(
              (doc) => doc.type === docType.type
            );
            const isUploaded = uploadedDocuments[docType.type];
            const uploadStatus = uploadStatuses[docType.type];

            return (
              <div
                key={docType.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {docType.label}
                      {docType.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {docType.description}
                    </p>
                  </div>
                  {existingDocument && (
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(existingDocument.status)}
                      <span className="text-sm capitalize">
                        {existingDocument.status.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                </div>

                {existingDocument?.rejectionReason && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">
                      <strong>Rejection Reason:</strong>{' '}
                      {existingDocument.rejectionReason}
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  {isUploaded ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <FileImage className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-700">
                        {isUploaded.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(isUploaded.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <button
                        onClick={() => handleDocumentRemove(docType.type)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <DocumentUploader
                        documentType={docType}
                        onUpload={(file) =>
                          handleDocumentUpload(docType.type, file)
                        }
                        onError={(error) => {
                          setUploadStatuses((prev) => ({
                            ...prev,
                            [docType.type]: 'error',
                          }));
                          toast.error(error);
                        }}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Ready to Submit?</h3>
            <p className="text-gray-600 text-sm">
              Once submitted, your documents will be reviewed within 1-2
              business days.
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isFormValid() && !isSubmitting
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit for Verification'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCVerificationForm;
