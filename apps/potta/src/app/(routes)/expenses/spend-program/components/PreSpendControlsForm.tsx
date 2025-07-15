import React from 'react';
import Button from '@potta/components/button';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import AccordionSelectField from '@potta/components/AccordionSelectField';
import { LuUserRoundCheck } from 'react-icons/lu';
import { RxCursorArrow } from 'react-icons/rx';
import {
  FaUsers,
  FaUserCheck,
  FaUser,
  FaDollarSign,
  FaExchangeAlt,
} from 'react-icons/fa';

interface PreSpendControlsFormProps {
  programName: string;
  onCreate: () => void;
  onBack: () => void;
  onPreview: () => void;
  showPreviewModal: boolean;
}

const PreSpendControlsForm: React.FC<PreSpendControlsFormProps> = ({
  programName,
  onCreate,
  onBack,
  onPreview,
  showPreviewModal,
}) => {
  const [allowEmployees, setAllowEmployees] = React.useState('all');
  const [requestedBy, setRequestedBy] = React.useState('all');
  const [approver, setApprover] = React.useState('manager');
  const [paymentMethod, setPaymentMethod] = React.useState('purchase_order');
  const [canChangePayment, setCanChangePayment] = React.useState('yes');
  const [approvalPolicy, setApprovalPolicy] = React.useState('spend_requests');

  return (
    <div className="w-full max-w-[1000px] mx-auto p-8  ">
      <div className="flex items-center justify-between mb-4">
        <button
          className="text-sm text-gray-500 hover:underline"
          onClick={onBack}
        >
          &larr; Previous
        </button>
        <div className="flex items-center gap-2">
          <Button
            text={`Create "${programName}"`}
            type="button"
            className="text-sm"
            onClick={onCreate}
            icon={<i className="ri-file-add-line"></i>}
          />
          <Button
            text={showPreviewModal ? 'Hide preview' : 'View preview'}
            type="button"
            className="text-sm"
            onClick={onPreview}
            icon={showPreviewModal ? <FiEyeOff /> : <FiEye />}
          />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-6">
        Create "{programName || 'Procurement - Contractors'}"
      </h1>
      <div className="mb-6 border border-gray-200">
        <div className="flex justify-between p-4 items-center">
          <div className="">
            <div className=" text-lg font-semibold">
              {programName || 'Procurement - Contractors'}
            </div>
            <div className="text-gray-500 text-sm">All customer requests.</div>
          </div>
          <FaEdit className="text-gray-700" />
        </div>
        <hr />
        <div className="flex items-center p-4 justify-between">
          <div className="flex flex-col">
            <div className="text-sm font-semibold">Spend program type</div>
            <div className="text-gray-700">Procurement</div>
          </div>
          <FaEdit className="text-gray-700" />
        </div>
      </div>
      <div className="mb-8 pb-8">
        <div className="text-xl font-bold mb-4">Pre-spend controls</div>
        <AccordionSelectField
          label="Allow employees to request from this program"
          icon={<RxCursorArrow />}
          value={allowEmployees}
          onChange={setAllowEmployees}
          options={[
            { value: 'all', label: 'All employees' },
            { value: 'managers', label: 'Managers only' },
          ]}
          placeholder="Select employees"
        />

        <AccordionSelectField
          label="Who needs to approve procurement requests?"
          icon={<LuUserRoundCheck />}
          value={approver}
          onChange={setApprover}
          options={[
            { value: 'manager', label: 'Manager' },
            { value: 'finance', label: 'Finance Team' },
            { value: 'admin', label: 'Admin' },
            { value: 'custom', label: 'Custom...' },
          ]}
          placeholder="Select approver(s)"
        />
        <AccordionSelectField
          label="What's the default payment method for procurement requests?"
          icon={<FaDollarSign />}
          value={paymentMethod}
          onChange={setPaymentMethod}
          options={[
            { value: 'purchase_order', label: 'Purchase order' },
            { value: 'credit_card', label: 'Credit card' },
            { value: 'bank_transfer', label: 'Bank transfer' },
          ]}
          placeholder="Select payment method"
        />
        <AccordionSelectField
          label="Can the payment method be changed by approvers and admins?"
          icon={<FaExchangeAlt />}
          value={canChangePayment}
          onChange={setCanChangePayment}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          placeholder="Select option"
        />
      </div>
    </div>
  );
};

export default PreSpendControlsForm;
