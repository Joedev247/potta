'use client';

import React, { useState, useRef } from 'react';
import {
  IoClose,
  IoCloudUpload,
  IoDocument,
  IoCheckmarkCircle,
  IoAlertCircle,
  IoDownload,
} from 'react-icons/io5';
import { orgChartApi } from '../utils/api';
import { toast } from 'react-hot-toast';
import { BulkInviteResponse } from '../types';

interface BulkInvitationUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  organizationId: string;
}

interface UploadResult {
  success: boolean;
  results?: BulkInviteResponse;
  error?: string;
}

export default function BulkInvitationUpload({
  isOpen,
  onClose,
  organizationId,
  onSuccess,
}: BulkInvitationUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setUploadResult(null);
    setIsUploading(false);
    setDragActive(false);
    onClose();
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadResult(null);

    try {
      const result = await orgChartApi.bulkInvite(file, organizationId);

      setUploadResult({
        success: true,
        results: result.data,
      });

      const successCount = result.data.results.length;
      const errorCount = result.data.errors.length;

      if (errorCount === 0) {
        toast.success(`Successfully sent ${successCount} invitations!`);
      } else {
        toast.success(
          `Sent ${successCount} invitations with ${errorCount} errors`
        );
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setUploadResult({
        success: false,
        error: error.response?.data?.message || 'Failed to upload file',
      });
      toast.error('Failed to process bulk invitations');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = `email,recipientName,role,temporaryPassword
john.doe@example.com,John Doe,MEMBER,TempPass123
jane.smith@example.com,Jane Smith,ADMIN,SecurePass456
mike.johnson@example.com,Mike Johnson,EMPLOYEE,MyPass789`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_bulk_invitations.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
          onClick={handleClose}
        />
      )}

      {/* Slider */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl z-[110] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Bulk Invitation Upload
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!uploadResult ? (
              <>
                {/* Instructions */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Upload CSV File
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload a CSV file with the following columns: email,
                    recipientName, role, temporaryPassword (optional)
                  </p>

                  <button
                    onClick={downloadSampleCSV}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
                  >
                    <IoDownload className="w-4 h-4 mr-2" />
                    Download Sample CSV
                  </button>
                </div>

                {/* Upload Area */}
                <div
                  className={`relative border-2 border-dashed p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />

                  {isUploading ? (
                    <div className="space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#237804] mx-auto"></div>
                      <p className="text-sm text-gray-600">
                        Processing invitations...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <IoCloudUpload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Drop your CSV file here
                        </p>
                        <p className="text-sm text-gray-600">
                          or click to browse files
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        CSV files only • Max size 10MB
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Results */
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  {uploadResult.success ? (
                    <IoCheckmarkCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <IoAlertCircle className="w-8 h-8 text-red-500" />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {uploadResult.success
                        ? 'Upload Complete'
                        : 'Upload Failed'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {uploadResult.success
                        ? 'Bulk invitations processed successfully'
                        : uploadResult.error}
                    </p>
                  </div>
                </div>

                {uploadResult.success && uploadResult.results && (
                  <div className="space-y-4">
                    {/* Success Summary */}
                    <div className="bg-green-50 border border-green-200 p-4">
                      <h4 className="font-medium text-green-800 mb-2">
                        Successfully Sent ({uploadResult.results.results.length}
                        )
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {uploadResult.results.results.map(
                          (invitation, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <IoCheckmarkCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-700">
                                {invitation.recipientName || invitation.email} -{' '}
                                {invitation.roleName}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Error Summary */}
                    {uploadResult.results.errors.length > 0 && (
                      <div className="bg-red-50 border border-red-200 p-4">
                        <h4 className="font-medium text-red-800 mb-2">
                          Errors ({uploadResult.results.errors.length})
                        </h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {uploadResult.results.errors.map((error, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <IoAlertCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-700">
                                Row {error.row + 1}: {error.error}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  >
                    Close
                  </button>
                  {uploadResult.success && (
                    <button
                      onClick={() => setUploadResult(null)}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#237804] border border-transparent hover:bg-[#1D6303] focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                    >
                      Upload Another
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
