'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Button from '@potta/components/button';
import Input from '@potta/components/input';
import Slider from '@potta/components/slideover';
import { toast } from 'react-hot-toast';
import {
  useGetPTOPolicy,
  useAccrueLeave,
  useRequestLeave,
  useResetPTOCycle,
} from '../hooks/usePTOActions';
import CustomDatePicker from '@potta/components/customDatePicker';
import { CalendarDate } from '@internationalized/date';

interface PTODetailSliderProps {
  ptoId: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PTODetailSlider: React.FC<PTODetailSliderProps> = ({
  ptoId,
  open,
  setOpen,
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [accrualAmount, setAccrualAmount] = useState('');
  const [leaveRequest, setLeaveRequest] = useState({
    days: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const { mutate: getPTOPolicy, data: ptoData, isLoading } = useGetPTOPolicy();
  const { mutate: accrueLeave, isLoading: isAccruing } = useAccrueLeave();
  const { mutate: requestLeave, isLoading: isRequesting } = useRequestLeave();
  const { mutate: resetCycle, isLoading: isResetting } = useResetPTOCycle();

  // Fetch PTO details when slider opens
  useEffect(() => {
    if (open && ptoId) {
      console.log('Fetching PTO details for ID:', ptoId);
      getPTOPolicy(ptoId);
    }
  }, [open, ptoId, getPTOPolicy]);

  // Debug logs
  useEffect(() => {
    console.log('PTODetailSlider - open:', open);
    console.log('PTODetailSlider - ptoId:', ptoId);
    console.log('PTODetailSlider - ptoData:', ptoData);
  }, [open, ptoId, ptoData]);

  const handleAccrueLeave = () => {
    if (!ptoId) return;

    if (
      !accrualAmount ||
      isNaN(parseFloat(accrualAmount)) ||
      parseFloat(accrualAmount) <= 0
    ) {
      toast.error('Please enter a valid accrual amount');
      return;
    }

    // According to API: PUT /api/paid-time-off/accrue/{id}
    accrueLeave(
      {
        id: ptoId,
        amount: parseFloat(accrualAmount),
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            toast.success('Leave accrued successfully');
            setAccrualAmount('');
            // Refresh PTO data
            getPTOPolicy(ptoId);
          } else {
            toast.error('Failed to accrue leave');
          }
        },
        onError: () => {
          toast.error('An error occurred while accruing leave');
        },
      }
    );
  };

  const handleRequestLeave = () => {
    if (!ptoId) return;

    if (
      !leaveRequest.days ||
      isNaN(parseFloat(leaveRequest.days)) ||
      parseFloat(leaveRequest.days) <= 0
    ) {
      toast.error('Please enter a valid number of days');
      return;
    }

    if (!leaveRequest.startDate || !leaveRequest.endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    if (!leaveRequest.reason.trim()) {
      toast.error('Please provide a reason for the leave request');
      return;
    }

    // According to API: PUT /api/paid-time-off/request-leave/{id}
    requestLeave(
      {
        id: ptoId,
        days: parseFloat(leaveRequest.days),
        start_date: leaveRequest.startDate, // Match API expected field name
        end_date: leaveRequest.endDate, // Match API expected field name
        reason: leaveRequest.reason,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            toast.success('Leave requested successfully');
            setLeaveRequest({
              days: '',
              startDate: '',
              endDate: '',
              reason: '',
            });
            // Refresh PTO data
            getPTOPolicy(ptoId);
          } else {
            toast.error(result.message || 'Failed to request leave');
          }
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            'An error occurred while requesting leave';
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleResetCycle = () => {
    if (!ptoId) return;

    if (
      window.confirm(
        'Are you sure you want to reset the PTO cycle? This action cannot be undone.'
      )
    ) {
      // According to API: PUT /api/paid-time-off/reset-cycle/{id}
      resetCycle(ptoId, {
        onSuccess: (result) => {
          if (result.success) {
            toast.success('PTO cycle reset successfully');
            // Refresh PTO data
            getPTOPolicy(ptoId);
          } else {
            toast.error('Failed to reset PTO cycle');
          }
        },
        onError: () => {
          toast.error('An error occurred while resetting the PTO cycle');
        },
      });
    }
  };

  const handleStartDateChange = useCallback((value: CalendarDate | null) => {
    if (value) {
      const formattedDate = `${value.year}-${String(value.month).padStart(
        2,
        '0'
      )}-${String(value.day).padStart(2, '0')}`;
      setLeaveRequest((prev) => ({ ...prev, startDate: formattedDate }));
    }
  }, []);

  const handleEndDateChange = useCallback((value: CalendarDate | null) => {
    if (value) {
      const formattedDate = `${value.year}-${String(value.month).padStart(
        2,
        '0'
      )}-${String(value.day).padStart(2, '0')}`;
      setLeaveRequest((prev) => ({ ...prev, endDate: formattedDate }));
    }
  }, []);

  const getStartDate = useCallback(() => {
    try {
      if (leaveRequest.startDate) {
        const [year, month, day] = leaveRequest.startDate
          .split('-')
          .map(Number);
        return new CalendarDate(year, month, day);
      }
      return null;
    } catch (error) {
      console.error('Error creating CalendarDate from startDate:', error);
      return null;
    }
  }, [leaveRequest.startDate]);

  const getEndDate = useCallback(() => {
    try {
      if (leaveRequest.endDate) {
        const [year, month, day] = leaveRequest.endDate.split('-').map(Number);
        return new CalendarDate(year, month, day);
      }
      return null;
    } catch (error) {
      console.error('Error creating CalendarDate from endDate:', error);
      return null;
    }
  }, [leaveRequest.endDate]);

  const handleInputChange = useCallback(
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (name === 'accrualAmount') {
        setAccrualAmount(value);
      } else {
        setLeaveRequest((prev) => ({ ...prev, [name]: value }));
      }
    },
    []
  );

  const pto = ptoData?.data;

  return (
    <Slider
      edit={false}
      title={pto ? `PTO: ${pto.type}` : 'PTO Details'}
      open={open}
      setOpen={setOpen}
      closeButton={false}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          Loading PTO details...
        </div>
      ) : pto ? (
        <div className="flex flex-col gap-5 w-full max-w-4xl">
          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 ${
                activeTab === 'details'
                  ? 'border-b-2 border-blue-500 font-medium'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            {/* <button
              className={`px-4 py-2 ${
                activeTab === 'accrue'
                  ? 'border-b-2 border-blue-500 font-medium'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('accrue')}
            >
              Accrue Leave
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'request'
                  ? 'border-b-2 border-blue-500 font-medium'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('request')}
            >
              Request Leave
            </button> */}
            <button
              className={`px-4 py-2 ${
                activeTab === 'admin'
                  ? 'border-b-2 border-blue-500 font-medium'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('admin')}
            >
               Actions
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{pto.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cycle Type</p>
                <p className="font-medium">{pto.cycle_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Accrual Rate</p>
                <p className="font-medium">{pto.accrual_rate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Entitled Days</p>
                <p className="font-medium">{pto.total_entitled_days}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Days Used</p>
                <p className="font-medium">{pto.days_used}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Days Remaining</p>
                <p className="font-medium">{pto.days_remaining}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">
                  {new Date(pto.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium">
                  {new Date(pto.end_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{pto.status}</p>
              </div>
            </div>
          )}

          {activeTab === 'accrue' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm">
                Accrue additional leave for this PTO policy.
              </p>

              <div>
                <p className="mb-2 font-medium">Accrual Amount (days)</p>
                <Input
                  name="accrualAmount"
                  type="text"
                  placeholder="Enter amount to accrue"
                  value={accrualAmount}
                  onchange={handleInputChange('accrualAmount')}
                />
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  text={isAccruing ? 'Processing...' : 'Accrue Leave'}
                  type={'button'}
                  onClick={handleAccrueLeave}
                  disabled={isAccruing}
                />
              </div>
            </div>
          )}

          {activeTab === 'request' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm">Request leave using this PTO policy.</p>

              <div>
                <p className="mb-2 font-medium">Number of Days</p>
                <Input
                  name="days"
                  type="text"
                  placeholder="Enter number of days"
                  value={leaveRequest.days}
                  onchange={handleInputChange('days')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <CustomDatePicker
                    label="Start Date"
                    placeholder="Select start date"
                    value={getStartDate()}
                    onChange={handleStartDateChange}
                    isRequired={true}
                  />
                </div>
                <div>
                  <CustomDatePicker
                    label="End Date"
                    placeholder="Select end date"
                    value={getEndDate()}
                    onChange={handleEndDateChange}
                    isRequired={true}
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 font-medium">Reason</p>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                  placeholder="Enter reason for leave"
                  value={leaveRequest.reason}
                  onChange={(e) =>
                    setLeaveRequest((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  text={isRequesting ? 'Processing...' : 'Request Leave'}
                  type={'button'}
                  onClick={handleRequestLeave}
                  disabled={isRequesting}
                />
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm">
                Administrative actions for this PTO policy.
              </p>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Reset PTO Cycle</h3>
                <p className="text-sm text-gray-500 mb-4">
                  This will reset the PTO cycle, setting days used back to zero
                  and recalculating days remaining. This action cannot be
                  undone.
                </p>
                <Button
                  text={isResetting ? 'Processing...' : 'Reset Cycle'}
                  type={'button'}
                  onClick={handleResetCycle}
                  disabled={isResetting}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            PTO policy not found or an error occurred.
          </p>
        </div>
      )}
    </Slider>
  );
};

export default PTODetailSlider;
