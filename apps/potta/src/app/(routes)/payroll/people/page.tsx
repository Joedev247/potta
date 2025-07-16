'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import RootLayout from '../../layout';
import Button from '@potta/components/button';
import CustomLoader from '@potta/components/loader';
import Search from '@potta/components/search';
import Slider from '@potta/components/slideover';
import dynamic from 'next/dynamic';
import EmployeeTable, { Employee } from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import ConfirmationModal from './components/ConfirmationModal';
import { useEmployeeAPI } from './hooks/useEmployeeAPI';
import { DEFAULT_PAGE_SIZE, STORAGE_KEYS } from './constants';

const EmployeeDetailsPage = dynamic(() => import('./[id]/page'), {
  ssr: false,
});

const People = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalAnimation, setModalAnimation] = useState('animate-slide-in-top');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [employeeToDeleteName, setEmployeeToDeleteName] = useState<string>('');

  const {
    employees,
    isFetching,
    currentPage,
    totalPages,
    pageSize,
    fetchEmployees,
    deleteEmployee,
    handlePageChange,
  } = useEmployeeAPI();

  // Fetch employees on initial load
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handle employee actions
  const handleViewEmployee = (id: string) => {
    setSelectedEmployeeId(id);
    setDetailsOpen(true);
  };

  const handleEditEmployee = (id: string) => {
    // Set the person ID for editing and open modal
    console.log('🔵 Edit button clicked for employee:', id);
    localStorage.setItem('potta_personId', id);
    console.log(
      '🔵 PersonId set in localStorage:',
      localStorage.getItem('potta_personId')
    );
    setIsEditMode(true);
    handleOpenModal();
  };

  const handleRowClick = (employee: Employee) => {
    setSelectedEmployeeId(employee.uuid);
    setDetailsOpen(true);
  };

  // Modal handlers
  const handleOpenModal = () => {
    setModalAnimation('animate-slide-in-top');
    setShowModal(true);
  };

  const handleNewEmployee = () => {
    // Clear any saved data for new employee
    localStorage.removeItem('potta_personId');
    setIsEditMode(false);
    handleOpenModal();
  };

  const handleCloseModal = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    setModalAnimation('animate-slide-out-top');
    setTimeout(() => {
      setShowModal(false);
      setIsEditMode(false); // Reset edit mode on close
      // Clear localStorage on close
      const storageKeys = [
        STORAGE_KEYS.PERSON_ID,
        STORAGE_KEYS.ACTIVE_STEP,
        STORAGE_KEYS.BASE_INFO,
        STORAGE_KEYS.ADDRESS,
        STORAGE_KEYS.BANK_ACCOUNT,
        STORAGE_KEYS.COMPENSATION,
        STORAGE_KEYS.SCHEDULE,
        STORAGE_KEYS.BENEFIT,
        STORAGE_KEYS.TAX_INFO,
      ];
      storageKeys.forEach((key) => localStorage.removeItem(key));
    }, 300);
  };

  const handleCancelClose = () => {
    setShowConfirmModal(false);
  };

  // Delete confirmation handlers
  const handleDeleteEmployee = (id: string) => {
    const employee = employees.find((emp) => emp.uuid === id);
    const employeeName = employee
      ? `${employee.firstName} ${employee.lastName}`
      : 'this employee';

    setEmployeeToDelete(id);
    setEmployeeToDeleteName(employeeName);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (employeeToDelete) {
      await deleteEmployee(employeeToDelete);
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
      setEmployeeToDeleteName('');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
    setEmployeeToDeleteName('');
  };

  const closeModalWithoutConfirmation = () => {
    setModalAnimation('animate-slide-out-top');
    setTimeout(() => {
      setShowModal(false);
      setIsEditMode(false); // Reset edit mode on close
      // Clear localStorage on close
      const storageKeys = [
        STORAGE_KEYS.PERSON_ID,
        STORAGE_KEYS.ACTIVE_STEP,
        STORAGE_KEYS.BASE_INFO,
        STORAGE_KEYS.ADDRESS,
        STORAGE_KEYS.BANK_ACCOUNT,
        STORAGE_KEYS.COMPENSATION,
        STORAGE_KEYS.SCHEDULE,
        STORAGE_KEYS.BENEFIT,
        STORAGE_KEYS.TAX_INFO,
      ];
      storageKeys.forEach((key) => localStorage.removeItem(key));
    }, 300);
  };

  const handleModalComplete = () => {
    setIsEditMode(false); // Reset edit mode
    closeModalWithoutConfirmation();
    fetchEmployees(); // Refresh the employee list
  };

  return (
    <RootLayout>
      <div className="w-full p-6 pl-12">
        <div className="flex justify-between items-center mb-6">
          <Search placeholder="Search People" />
          <Button
            text="New Employee"
            type="button"
            onClick={handleNewEmployee}
          />
        </div>

        {isFetching ? (
          <CustomLoader />
        ) : (
          <EmployeeTable
            employees={employees}
            onViewEmployee={handleViewEmployee}
            onEditEmployee={handleEditEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onRowClick={handleRowClick}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Employee Modal */}
      <EmployeeModal
        showModal={showModal}
        modalAnimation={modalAnimation}
        onClose={handleCloseModal}
        onComplete={handleModalComplete}
        isEditMode={isEditMode}
      />

      {/* Employee Details Slideover */}
      <Slider
        edit={false}
        title="Employee Details"
        open={detailsOpen}
        setOpen={setDetailsOpen}
        noPanelScroll={true}
      >
        {selectedEmployeeId && (
          <EmployeeDetailsPage
            key={selectedEmployeeId}
            employeeId={selectedEmployeeId}
          />
        )}
      </Slider>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        title="Unsaved Changes"
        message="Are you sure you want to close? Any unsaved changes will be lost."
        confirmText="Close Anyway"
        cancelText="Keep Editing"
        type="warning"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employeeToDeleteName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Modal animations */}
      <style jsx global>{`
        @keyframes slideInTop {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes slideOutTop {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-100%);
          }
        }

        .animate-slide-in-top {
          animation: slideInTop 0.3s ease-out forwards;
        }

        .animate-slide-out-top {
          animation: slideOutTop 0.3s ease-in forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </RootLayout>
  );
};

export default People;
