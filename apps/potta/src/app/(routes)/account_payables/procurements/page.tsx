'use client';
import React, { useState, useMemo } from 'react';
import RootLayout from '../../layout';
import { Badge } from '@potta/components/shadcn/badge';
import Search from '@potta/components/search';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@potta/components/shadcn/dropdown';
import Button from '@potta/components/button';
import {
  ChevronDown,
  ShoppingCart,
  FileText,
  Package,
  Truck,
  MoreVertical,
  Send,
  CheckCircle,
  XCircle,
  Eye,
  Mail,
} from 'lucide-react';
import { ContextData } from '@potta/components/context';
import { Skeleton } from '@potta/components/shadcn/skeleton';
import { useCallback } from 'react';
import {
  useGetSpendRequests,
  useGetRFQs,
  useSubmitSpendRequest,
  useApproveSpendRequest,
  useRejectSpendRequest,
  useCreateRFQ,
  useSendRFQ,
  useCloseRFQ,
} from './hooks/useProcurement';
import type { SpendRequest, RFQ, SpendRequestPriority } from './utils/types';
import NewSpendRequestSlideover from './components/NewSpendRequestSlideover';
import CreateRFQModal from './components/CreateRFQModal';
import ViewDetailsModal from './components/ViewDetailsModal';
import SendRFQModal from './components/SendRFQModal';
import useGetAllVendors from '../../vendors/hooks/useGetAllVendors';
import { useEmployees } from '../spend-program/hooks/useEmployees';

// Combined item type for display
interface ProcurementItem {
  id: string;
  name: string;
  type: 'SPEND_REQUEST' | 'RFQ';
  description: string;
  status: string;
  vendor: string;
  amount: number;
  items: number;
  priority?: SpendRequestPriority;
  requestNumber?: string;
  rfqNumber?: string;
  deadline?: string;
  createdAt?: string;
}

const filterOptions = [
  { label: 'All items', value: 'all' },
  { label: 'Spend Requests', value: 'SPEND_REQUEST' },
  { label: 'RFQs', value: 'RFQ' },
];

// Helper function to get icon based on type
const getItemIcon = (type: string) => {
  switch (type) {
    case 'SPEND_REQUEST':
      return <ShoppingCart className="w-6 h-6 text-green-600" />;
    case 'RFQ':
      return <FileText className="w-6 h-6 text-blue-600" />;
    default:
      return <FileText className="w-6 h-6 text-gray-600" />;
  }
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  const statusLower = status?.toLowerCase();
  switch (statusLower) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending_approval':
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'sent':
    case 'responses_received':
      return 'bg-blue-100 text-blue-800';
    case 'closed':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper to format status text
const formatStatus = (status: string) => {
  return (
    status
      ?.replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Draft'
  );
};

const ProcurementsPage = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(filterOptions[0].value);
  const [filterLabel, setFilterLabel] = useState(filterOptions[0].label);
  const [slideoverOpen, setSlideoverOpen] = useState(false);
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [selectedSpendRequestId, setSelectedSpendRequestId] = useState<
    string | null
  >(null);
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<
    'SPEND_REQUEST' | 'RFQ'
  >('SPEND_REQUEST');
  const [sendRFQModalOpen, setSendRFQModalOpen] = useState(false);
  const [selectedRFQId, setSelectedRFQId] = useState<string | null>(null);
  const context = React.useContext(ContextData);

  // Mutations for actions
  const submitMutation = useSubmitSpendRequest();
  const approveMutation = useApproveSpendRequest();
  const rejectMutation = useRejectSpendRequest();
  const createRFQMutation = useCreateRFQ();
  const sendRFQMutation = useSendRFQ();
  const closeRFQMutation = useCloseRFQ();

  // Fetch spend requests
  const {
    data: spendRequests = [],
    isLoading: loadingSpendRequests,
    isError: errorSpendRequests,
    refetch: refetchSpendRequests,
  } = useGetSpendRequests();

  // Fetch RFQs
  const {
    data: rfqs = [],
    isLoading: loadingRFQs,
    isError: errorRFQs,
    refetch: refetchRFQs,
  } = useGetRFQs();

  // Fetch vendors to map UUIDs to names
  const { data: vendorsData } = useGetAllVendors({
    page: 1,
    limit: 200,
  });

  const vendors = vendorsData?.data || [];

  // Fetch employees/users to map UUIDs to names
  const { data: employees = [] } = useEmployees();

  const isLoading = loadingSpendRequests || loadingRFQs;
  const isError = errorSpendRequests || errorRFQs;

  // Helper function to get vendor name by UUID
  const getVendorName = useCallback(
    (vendorId?: string) => {
      if (!vendorId) return 'No vendor';
      const vendor = vendors.find(
        (v: any) => v.uuid === vendorId || v.id === vendorId
      );
      return vendor?.name || 'Unknown vendor';
    },
    [vendors]
  );

  // Helper function to get user name by UUID
  const getUserName = useCallback(
    (userId?: string) => {
      if (!userId) return 'N/A';
      const employee = employees.find(
        (e: any) => e.uuid === userId || e.id === userId
      );
      if (employee) {
        return (
          `${employee.firstName} ${employee.lastName}`.trim() || employee.email
        );
      }
      return 'Unknown user';
    },
    [employees]
  );

  // Combine and transform data
  const allItems = useMemo(() => {
    const spendRequestItems: ProcurementItem[] = (spendRequests || []).map(
      (sr: SpendRequest) => ({
        id: sr.uuid || sr.id || '',
        name: sr.title,
        type: 'SPEND_REQUEST' as const,
        description: sr.description,
        status: sr.status || 'DRAFT',
        vendor: getVendorName(sr.items?.[0]?.vendorId),
        amount: parseFloat(sr.requestedAmount?.toString() || '0'),
        items: sr.items?.length || 0,
        priority: sr.priority,
        requestNumber: sr.requestNumber,
        createdAt: sr.createdAt,
      })
    );

    const rfqItems: ProcurementItem[] = (rfqs || []).map((rfq: RFQ) => ({
      id: rfq.uuid || rfq.id || '',
      name: rfq.title,
      type: 'RFQ' as const,
      description: rfq.description,
      status: rfq.status || 'DRAFT',
      vendor: rfq.vendorList?.length
        ? `${rfq.vendorList.length} vendors`
        : 'No vendors',
      amount: 0, // RFQs don't have amount until responses come
      items: rfq.requirements?.items?.length || 0,
      rfqNumber: rfq.rfqNumber,
      deadline: rfq.deadline,
      createdAt: rfq.createdAt,
    }));

    return [...spendRequestItems, ...rfqItems];
  }, [spendRequests, rfqs, getVendorName]);

  // Filter items based on search and active filter
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.vendor?.toLowerCase().includes(search.toLowerCase()) ||
        item.requestNumber?.toLowerCase().includes(search.toLowerCase()) ||
        item.rfqNumber?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        activeFilter === 'all' || item.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [allItems, search, activeFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle actions
  const handleSubmit = async (id: string) => {
    await submitMutation.mutateAsync(id);
  };

  const handleApprove = async (id: string) => {
    await approveMutation.mutateAsync({ id, data: { comments: 'Approved' } });
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      await rejectMutation.mutateAsync({
        id,
        data: { rejectionReason: reason },
      });
    }
  };

  const handleCreateRFQ = async (itemId: string) => {
    setSelectedSpendRequestId(itemId);
    setRfqModalOpen(true);
  };

  const handleSendRFQ = async (id: string) => {
    setSelectedRFQId(id);
    setSendRFQModalOpen(true);
  };

  const handleCloseRFQ = async (id: string) => {
    const reason = prompt('Enter reason for closing:');
    if (reason) {
      await closeRFQMutation.mutateAsync({ id, data: { reason } });
    }
  };

  return (
    <RootLayout>
      <div
        className={`${
          context?.layoutMode === 'sidebar' ? 'pl-16' : 'pl-5'
        } pr-5 pt-2`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex-1 ">
              <Search
                placeholder="search procurement items"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-3 border  bg-white text-black text-sm flex items-center gap-2 min-w-[]">
                  {filterLabel}
                  <ChevronDown size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="!rounded-none min-w-[142px]"
              >
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => {
                      setActiveFilter(option.value);
                      setFilterLabel(option.label);
                    }}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <Button
              text="New Spend Request"
              type="button"
              onClick={() => setSlideoverOpen(true)}
            />
          </div>
        </div>

        {isLoading && (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            }}
          >
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 p-6 flex flex-col gap-4 rounded-md"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="bg-green-50 p-2 rounded w-10 h-10" />
                  <Skeleton className="h-6 w-32 flex-1" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <div className="flex items-center justify-between border-t pt-3 mt-2">
                  <Skeleton className="h-4 w-16 rounded-lg" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-red-500">Failed to load procurement items.</div>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No procurement items found
            </h3>
            <p className="text-gray-500">
              {search
                ? 'Try adjusting your search or filter'
                : 'Get started by creating your first purchase order'}
            </p>
          </div>
        )}

        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          }}
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border cursor-pointer border-gray-200 p-6 flex flex-col gap-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-50 p-2 rounded">
                  {getItemIcon(item.type)}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.name.length > 16
                      ? `${item.name.slice(0, 16)}...`
                      : item.name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {item.requestNumber || item.rfqNumber || 'N/A'}
                  </p>
                </div>
                <Badge
                  className={`${getStatusColor(
                    item.status
                  )} font-medium rounded-full px-3 py-1 text-xs`}
                >
                  {formatStatus(item.status)}
                </Badge>

                {/* Action Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {item.type === 'SPEND_REQUEST' && (
                      <>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setSelectedItemType('SPEND_REQUEST');
                            setViewDetailsModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>

                        {item.status === 'DRAFT' && (
                          <DropdownMenuItem
                            onClick={() => handleSubmit(item.id)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Submit for Approval
                          </DropdownMenuItem>
                        )}

                        {item.status === 'PENDING_APPROVAL' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleApprove(item.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              <span className="text-green-600">Approve</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReject(item.id)}
                            >
                              <XCircle className="w-4 h-4 mr-2 text-red-600" />
                              <span className="text-red-600">Reject</span>
                            </DropdownMenuItem>
                          </>
                        )}

                        {item.status === 'APPROVED' && (
                          <DropdownMenuItem
                            onClick={() => handleCreateRFQ(item.id)}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Create RFQ
                          </DropdownMenuItem>
                        )}
                      </>
                    )}

                    {item.type === 'RFQ' && (
                      <>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setSelectedItemType('RFQ');
                            setViewDetailsModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>

                        {(item.status === 'DRAFT' ||
                          item.status === 'RESPONSES_RECEIVED') && (
                          <DropdownMenuItem
                            onClick={() => handleSendRFQ(item.id)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send to Vendors
                          </DropdownMenuItem>
                        )}

                        {item.status === 'SENT' && (
                          <DropdownMenuItem
                            onClick={() => handleCloseRFQ(item.id)}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Close RFQ
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-gray-500 text-sm mb-2">{item.description}</p>
              <div className="flex items-center justify-between border-t pt-3 mt-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">
                    {item.type === 'RFQ' ? 'Vendors' : 'Vendor'}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {item.vendor}
                  </span>
                </div>
                {item.amount > 0 && (
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-xs text-gray-500">Amount</span>
                    <span className="text-sm font-bold text-green-900">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                )}
                {item.type === 'RFQ' && item.deadline && (
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-xs text-gray-500">Deadline</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(item.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Package className="w-4 h-4" />
                  {item.items} items
                </span>
                <div className="flex rounde items-center gap-2">
                  {item.priority && (
                    <span
                      className={`text-xs rounded-full px-2 py-1 ${
                        item.priority === 'URGENT'
                          ? 'bg-red-100 text-red-800'
                          : item.priority === 'HIGH'
                          ? 'bg-orange-100 text-orange-800'
                          : item.priority === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.priority}
                    </span>
                  )}
                  <span className="text-xs rounded-full bg-[#F3FBFB] px-3 py-1 text-gray-700">
                    {item.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Spend Request Slideover */}
        <NewSpendRequestSlideover
          open={slideoverOpen}
          setOpen={setSlideoverOpen}
          onCreated={() => {
            refetchSpendRequests();
          }}
        />

        {/* Create RFQ Modal */}
        <CreateRFQModal
          open={rfqModalOpen}
          setOpen={setRfqModalOpen}
          spendRequestId={selectedSpendRequestId}
          onCreated={() => {
            refetchSpendRequests();
          }}
        />

        {/* View Details Modal */}
        <ViewDetailsModal
          open={viewDetailsModalOpen}
          setOpen={setViewDetailsModalOpen}
          itemId={selectedItemId}
          type={selectedItemType}
          getVendorName={getVendorName}
          getUserName={getUserName}
        />

        {/* Send RFQ Modal */}
        <SendRFQModal
          open={sendRFQModalOpen}
          setOpen={setSendRFQModalOpen}
          rfqId={selectedRFQId}
          onSent={() => {
            refetchRFQs();
          }}
        />
      </div>
    </RootLayout>
  );
};

export default ProcurementsPage;
