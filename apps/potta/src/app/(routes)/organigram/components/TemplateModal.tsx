'use client';

import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { Template } from '../types';
import { orgChartApi } from '../utils/api';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template?: Template | null;
  onSave: (template: Partial<Template>) => void;
}

export default function TemplateModal({
  isOpen,
  onClose,
  template,
  onSave,
}: TemplateModalProps) {
  const [formData, setFormData] = useState<Partial<Template>>({
    template_name: '',
    template_type: 'STANDARD_OFFICE',
    structure_data: {},
    organization_id: '8f79d19a-5319-4783-8ddc-c863d98ecc16', // Default org ID
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (template) {
        setFormData(template);
      } else {
        setFormData({
          template_name: '',
          template_type: 'STANDARD_OFFICE',
          structure_data: {},
          organization_id: '8f79d19a-5319-4783-8ddc-c863d98ecc16', // Default org ID
        });
      }
      setErrors({});
    }
  }, [isOpen, template]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.template_name?.trim()) {
      newErrors.template_name = 'Template name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to clean form data by removing empty strings and null values
  const cleanFormData = (data: any): any => {
    const cleaned: any = {};

    Object.entries(data).forEach(([key, value]) => {
      // Only include the field if it has a meaningful value
      if (value !== null && value !== undefined && value !== '') {
        cleaned[key] = value;
      }
    });

    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Clean the form data to remove empty strings and null values
      const cleanedFormData = cleanFormData(formData);
      await onSave(cleanedFormData);
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {template ? 'Edit Template' : 'Add New Template'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name *
              </label>
              <input
                type="text"
                value={formData.template_name || ''}
                onChange={(e) =>
                  handleInputChange('template_name', e.target.value)
                }
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#237804] focus:border-transparent ${
                  errors.template_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter template name"
              />
              {errors.template_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.template_name}
                </p>
              )}
            </div>

            {/* Template Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Type
              </label>
              <select
                value={formData.template_type || 'STANDARD_OFFICE'}
                onChange={(e) =>
                  handleInputChange('template_type', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent"
              >
                <option value="STANDARD_OFFICE">Standard Office</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>

            {/* Structure Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Structure Data (JSON)
              </label>
              <textarea
                value={JSON.stringify(formData.structure_data || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    handleInputChange('structure_data', parsed);
                  } catch (error) {
                    // Keep the raw text if it's not valid JSON
                    console.warn('Invalid JSON structure data');
                  }
                }}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#237804] focus:border-transparent font-mono text-sm"
                placeholder='{"departments": [], "hierarchy": {}}'
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter the organizational structure data in JSON format
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-[#237804] hover:bg-[#1D6303] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading
                  ? 'Saving...'
                  : template
                  ? 'Update Template'
                  : 'Create Template'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
