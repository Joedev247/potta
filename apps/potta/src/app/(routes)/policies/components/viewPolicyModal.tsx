import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Policy } from '../utils/types';
import { PolicySummaryView } from './PolicySummaryView';

interface ViewPolicyModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  policy: Policy | null;
}

const ViewPolicyModal = ({ open, setOpen, policy }: ViewPolicyModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Handle animation when modal opens or closes
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  if (!isVisible || !policy) return null;

  return (
    <div className="fixed inset-0  z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={() => setOpen(false)}
      ></div>

      {/* Modal Container */}
      <div
        className={`fixed overflow-y-auto inset-0 bg-white transition-transform duration-300 ease-in-out transform ${
          isAnimating ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">View Policy</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div
          className="p-6 max-w-5xl mx-auto space-y-6 "
          style={{ maxHeight: 'calc(100vh - 140px)' }}
        >
          {/* Policy Overview */}
          <div>
            <h3 className="text-lg font-medium mb-2">Policy Overview</h3>
            <div className="bg-gray-50 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{policy.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{policy.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-medium">
                    {new Date(policy.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(policy.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Information */}
          {policy.budget && (
            <div>
              <h3 className="text-lg font-medium mb-2">Budget Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Budget Name</p>
                    <p className="font-medium">{policy.budget.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Budget ID</p>
                    <p className="font-medium">{policy.budget.budgetId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'XAF',
                      }).format(Number(policy.budget.totalAmount))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Amount</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'XAF',
                      }).format(Number(policy.budget.availableAmount))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rules */}
          <div>
            <h3 className="text-lg font-medium mb-2">Rules Preview</h3>
            <PolicySummaryView policy={policy} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPolicyModal;
