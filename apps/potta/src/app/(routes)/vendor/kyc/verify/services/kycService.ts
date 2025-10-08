import axios from 'config/axios.config';

// Types for KYC API
export interface KYCDocument {
  id: string;
  type: string;
  status: 'pending' | 'uploaded' | 'approved' | 'rejected';
  url?: string;
  rejectionReason?: string;
  uploadedAt?: string;
}

export interface KYCVendor {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  phone?: string;
  address?: string;
}

export interface KYCData {
  id: string;
  vendorId: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  documents: KYCDocument[];
  vendor: KYCVendor;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KYCVerificationRequest {
  token: string;
  vendorId: string;
  kycId: string;
}

export interface KYCDocumentUpload {
  type: string;
  file: File;
}

export interface KYCSubmissionRequest {
  token: string;
  vendorId: string;
  kycId: string;
  documents: KYCDocumentUpload[];
}

class KYCService {
  private basePath = '/vendor/kyc';

  /**
   * Get KYC verification details
   */
  async getKYCVerification(request: KYCVerificationRequest): Promise<KYCData> {
    try {
      const response = await axios.get(`${this.basePath}/verify`, {
        params: {
          token: request.token,
          vendorId: request.vendorId,
          kycId: request.kycId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching KYC verification:', error);
      throw error;
    }
  }

  /**
   * Submit KYC documents for verification
   */
  async submitKYCDocuments(request: KYCSubmissionRequest): Promise<KYCData> {
    try {
      const formData = new FormData();

      // Add metadata
      formData.append('token', request.token);
      formData.append('vendorId', request.vendorId);
      formData.append('kycId', request.kycId);

      // Add documents
      request.documents.forEach((doc, index) => {
        formData.append(`documents[${index}][type]`, doc.type);
        formData.append(`documents[${index}][file]`, doc.file);
      });

      const response = await axios.post(`${this.basePath}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting KYC documents:', error);
      throw error;
    }
  }

  /**
   * Upload individual document
   */
  async uploadDocument(
    token: string,
    vendorId: string,
    kycId: string,
    documentType: string,
    file: File
  ): Promise<KYCDocument> {
    try {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('vendorId', vendorId);
      formData.append('kycId', kycId);
      formData.append('documentType', documentType);
      formData.append('file', file);

      const response = await axios.post(
        `${this.basePath}/upload-document`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  /**
   * Get KYC verification status
   */
  async getKYCStatus(
    token: string,
    vendorId: string,
    kycId: string
  ): Promise<{
    status: string;
    documents: KYCDocument[];
    lastUpdated: string;
  }> {
    try {
      const response = await axios.get(`${this.basePath}/status`, {
        params: {
          token,
          vendorId,
          kycId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      throw error;
    }
  }

  /**
   * Delete uploaded document
   */
  async deleteDocument(
    token: string,
    vendorId: string,
    kycId: string,
    documentId: string
  ): Promise<void> {
    try {
      await axios.delete(`${this.basePath}/document/${documentId}`, {
        params: {
          token,
          vendorId,
          kycId,
        },
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Resubmit KYC verification
   */
  async resubmitKYC(
    token: string,
    vendorId: string,
    kycId: string
  ): Promise<KYCData> {
    try {
      const response = await axios.post(`${this.basePath}/resubmit`, null, {
        params: {
          token,
          vendorId,
          kycId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error resubmitting KYC:', error);
      throw error;
    }
  }
}

export const kycService = new KYCService();
export default kycService;
