'use client';

import { useState, useEffect } from 'react';
import { UserAssignment } from '../types';
import { orgChartApi } from '../utils/api';
import { toast } from 'react-hot-toast';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  assignment: UserAssignment;
}

export default function UserDetailsModal({
  isOpen,
  onClose,
  userId,
  assignment,
}: UserDetailsModalProps) {
  const [userContext, setUserContext] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadUserContext();
    }
  }, [isOpen, userId]);

  const loadUserContext = async () => {
    try {
      setLoading(true);
      const context = await orgChartApi.getFullUserContext(userId);
      setUserContext(context.data);
    } catch (err) {
      console.error('Error loading user context:', err);
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">User Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#237804]"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Assignment Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                Assignment Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Job Title:</span>
                  <span className="ml-2">{assignment.job_title || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium">Assignment Type:</span>
                  <span className="ml-2">{assignment.assignment_type}</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      assignment.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {assignment.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Start Date:</span>
                  <span className="ml-2">
                    {assignment.start_date
                      ? new Date(assignment.start_date).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* User Context */}
            {userContext && (
              <div className="space-y-4">
                {/* Location */}
                {userContext.location && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      📍 Location
                    </h4>
                    <div className="text-sm">
                      <div>
                        <span className="font-medium">Name:</span>{' '}
                        {userContext.location.location_name}
                      </div>
                      <div>
                        <span className="font-medium">Address:</span>{' '}
                        {userContext.location.address}
                      </div>
                      <div>
                        <span className="font-medium">City:</span>{' '}
                        {userContext.location.city}
                      </div>
                      <div>
                        <span className="font-medium">Country:</span>{' '}
                        {userContext.location.country}
                      </div>
                    </div>
                  </div>
                )}

                {/* Department */}
                {userContext.department && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      🏢 Department
                    </h4>
                    <div className="text-sm">
                      <div>
                        <span className="font-medium">Name:</span>{' '}
                        {userContext.department.department_name}
                      </div>
                      <div>
                        <span className="font-medium">Level:</span>{' '}
                        {userContext.department.level}
                      </div>
                      <div>
                        <span className="font-medium">Budget:</span>{' '}
                        {userContext.department.budget?.toLocaleString()} XAF
                      </div>
                    </div>
                  </div>
                )}

                {/* Business Unit */}
                {userContext.subBusiness && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      💼 Business Unit
                    </h4>
                    <div className="text-sm">
                      <div>
                        <span className="font-medium">Name:</span>{' '}
                        {userContext.subBusiness.business_name}
                      </div>
                      <div>
                        <span className="font-medium">Level:</span>{' '}
                        {userContext.subBusiness.level}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span>{' '}
                        {userContext.subBusiness.business_type || 'N/A'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Geographical Unit */}
                {userContext.geographicalUnit && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">
                      🌍 Geographical Unit
                    </h4>
                    <div className="text-sm">
                      <div>
                        <span className="font-medium">Name:</span>{' '}
                        {userContext.geographicalUnit.unit_name}
                      </div>
                      <div>
                        <span className="font-medium">Level:</span>{' '}
                        {userContext.geographicalUnit.level}
                      </div>
                      <div>
                        <span className="font-medium">Description:</span>{' '}
                        {userContext.geographicalUnit.description || 'N/A'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // TODO: Implement edit user assignment
                  toast.info('Edit functionality coming soon!');
                }}
                className="px-4 py-2 bg-[#237804] text-white hover:bg-[#1D6303]"
              >
                Edit Assignment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
