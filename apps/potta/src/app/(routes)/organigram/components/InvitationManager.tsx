'use client';

import { useState, useEffect } from 'react';
import {
  IoClose,
  IoMail,
  IoRefresh,
  IoTrash,
  IoCheckmark,
  IoTime,
} from 'react-icons/io5';
import { Invitation, InvitationListResponse } from '../types';
import { orgChartApi } from '../utils/api';

interface InvitationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSelect: (userId: string, user: any) => void;
}

export default function InvitationManager({
  isOpen,
  onClose,
  onUserSelect,
}: InvitationManagerProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>('pending');
  const [invitations, setInvitations] = useState<InvitationListResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadInvitations();
    }
  }, [isOpen]);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const result = await orgChartApi.getInvitations();
      setInvitations(result.data);
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvitation = async (token: string) => {
    try {
      setResending(token);
      await orgChartApi.resendInvitation(token);
      await loadInvitations(); // Refresh the list
    } catch (error) {
      console.error('Error resending invitation:', error);
    } finally {
      setResending(null);
    }
  };

  const handleResendAllPending = async () => {
    if (!invitations) return;

    const pendingInvitations = invitations.invitations.filter(
      (inv) => inv.status.toLowerCase() === 'pending'
    );

    try {
      setResending('all');
      await Promise.all(
        pendingInvitations.map((inv) => orgChartApi.resendInvitation(inv.token))
      );
      await loadInvitations(); // Refresh the list
    } catch (error) {
      console.error('Error resending all invitations:', error);
    } finally {
      setResending(null);
    }
  };

  const handleCancelInvitation = async (token: string) => {
    try {
      await orgChartApi.cancelInvitation(token);
      await loadInvitations(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling invitation:', error);
    }
  };

  const handleSelectAcceptedUser = (invitation: Invitation) => {
    if (invitation.user) {
      onUserSelect(invitation.user.id, {
        id: invitation.user.id,
        email: invitation.user.email,
        full_name: invitation.recipientName,
      });
      onClose();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <IoTime className="w-4 h-4 text-yellow-500" />;
      case 'accepted':
        return <IoCheckmark className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <IoClose className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <IoTrash className="w-4 h-4 text-gray-500" />;
      default:
        return <IoTime className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'cancelled':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const pendingInvitations =
    invitations?.invitations.filter(
      (inv) => inv.status.toLowerCase() === 'pending'
    ) || [];
  const acceptedInvitations =
    invitations?.invitations.filter(
      (inv) => inv.status.toLowerCase() === 'accepted'
    ) || [];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Slider */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              User Management
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'text-[#237804] border-b-2 border-[#237804] bg-green-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Invitations ({pendingInvitations.length})
            </button>
            <button
              onClick={() => setActiveTab('accepted')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'accepted'
                  ? 'text-[#237804] border-b-2 border-[#237804] bg-green-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Accepted Users ({acceptedInvitations.length})
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#237804]"></div>
              </div>
            ) : (
              <div className="p-6">
                {activeTab === 'pending' ? (
                  <div className="space-y-4">
                    {/* Resend All Button */}
                    {pendingInvitations.length > 0 && (
                      <button
                        onClick={handleResendAllPending}
                        disabled={resending === 'all'}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#237804] text-white rounded-lg hover:bg-[#1D6303] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <IoRefresh className="w-4 h-4" />
                        <span>
                          {resending === 'all'
                            ? 'Resending...'
                            : 'Resend All Invitations'}
                        </span>
                      </button>
                    )}

                    {/* Pending Invitations List */}
                    {pendingInvitations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <IoMail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No pending invitations</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pendingInvitations.map((invitation) => (
                          <div
                            key={invitation.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                  {getStatusIcon(invitation.status)}
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                                      invitation.status
                                    )}`}
                                  >
                                    {invitation.status}
                                  </span>
                                </div>
                                <h3 className="font-medium text-gray-900 truncate">
                                  {invitation.recipientName || invitation.email}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">
                                  {invitation.email}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Sent:{' '}
                                  {new Date(
                                    invitation.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex flex-col space-y-2 ml-4">
                                <button
                                  onClick={() =>
                                    handleResendInvitation(invitation.token)
                                  }
                                  disabled={resending === invitation.token}
                                  className="p-2 text-[#237804] hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Resend invitation"
                                >
                                  <IoRefresh className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleCancelInvitation(invitation.token)
                                  }
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Cancel invitation"
                                >
                                  <IoTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Accepted Users List */}
                    {acceptedInvitations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <IoCheckmark className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No accepted users</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {acceptedInvitations.map((invitation) => (
                          <div
                            key={invitation.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                            onClick={() => handleSelectAcceptedUser(invitation)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-green-600">
                                  {(invitation.recipientName ||
                                    invitation.email)[0]?.toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">
                                  {invitation.recipientName || invitation.email}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">
                                  {invitation.email}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Accepted:{' '}
                                  {new Date(
                                    invitation.updatedAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <IoCheckmark className="w-5 h-5 text-green-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
