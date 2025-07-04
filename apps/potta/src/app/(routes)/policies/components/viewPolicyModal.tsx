import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Policy } from '../utils/types';
import { PolicySummaryView } from './PolicySummaryView';

interface ViewPolicyModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  policy: Policy | null;
}

// Move formatDate above the return so it's always defined
function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
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
          className="p-6 max-w-3xl mx-auto space-y-8"
          style={{ maxHeight: 'calc(100vh - 140px)' }}
        >
          {/* Policy Summary - refined professional layout */}
          <div className="bg-white border p-6  flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-2xl font-bold truncate">{policy.name}</h2>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                    policy.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {policy.status || '-'}
                </span>
              </div>
              <div className="flex gap-6 mt-2 text-sm text-gray-500 flex-wrap">
                <span>
                  Created:{' '}
                  <span className="font-medium text-gray-700">
                    {policy.createdAt ? formatDate(policy.createdAt) : '-'}
                  </span>
                </span>
                <span>
                  Updated:{' '}
                  <span className="font-medium text-gray-700">
                    {policy.updatedAt ? formatDate(policy.updatedAt) : '-'}
                  </span>
                </span>
              </div>
            </div>
            {/* Optionally add document link/type here if needed */}
          </div>

          {/* Rules Section - already styled below */}
          <PolicySummaryView policy={policy} />
        </div>
      </div>
    </div>
  );
};

export default ViewPolicyModal;
