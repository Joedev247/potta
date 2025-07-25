import React from 'react';

interface Approver {
  id: string;
  name: string;
  status: 'approved' | 'pending';
  imageUrl?: string;
}

const fieldLabels: Record<string, string> = {
  madeBy: 'Employee',
  madeTo: 'Merchant',
  amount: 'Amount',
  currency: 'Currency',
  memo: 'Memo',
  status: 'Status',
  category: 'Category',
  date: 'Date',
  type: 'Type',
  account: 'Account',
  limit: 'Limit',
};

const ReimbursementDetails = ({ data }: { data: any }) => {
  if (!data) return null;

  // Use data.approvers or fallback to mock data for demo
  const approvers: Approver[] = data.approvers || [
    { id: '1', name: 'Alice', status: 'approved' },
    { id: '2', name: 'Bob', status: 'pending' },
    { id: '3', name: 'Carol', status: 'pending' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
      {/* Reimbursement Details at the top */}

      {/* Approval Progress with a unique, flat vertical stepper design */}
      <div className="bg-gray-50 border border-gray-200 p-4 ">
        <div className="font-semibold text-gray-700 mb-4">
          Approval Progress
        </div>
        
        <div className="flex flex-col gap-0 w-full relative">
          {approvers.map((approver, idx) => (
            <React.Fragment key={approver.id}>
              <div className="flex items-center min-h-[56px]">
                {/* Stepper circle/initial/avatar */}
                <div className="flex flex-col items-center mr-4">
                  {approver.imageUrl ? (
                    <img
                      src={approver.imageUrl}
                      alt={approver.name}
                      className="w-10 h-10 bg-gray-200 rounded-full object-cover"
                      style={{ borderRadius: '100%' }}
                    />
                  ) : (
                    <div
                      className="w-10 h-10 bg-gray-200 flex rounded-full items-center justify-center text-gray-600 font-bold text-base"
                      style={{ borderRadius: '100%' }}
                    >
                      {approver.name[0]}
                    </div>
                  )}
                  {/* Vertical line except after last approver */}
                  {idx < approvers.length - 1 && (
                    <div
                      className={`w-0.5 flex-1 mt-1 ${
                        approver.status === 'approved'
                          ? 'bg-green-400'
                          : 'bg-gray-300'
                      }`}
                      style={{ minHeight: 32 }}
                    ></div>
                  )}
                </div>
                {/* Name and status */}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs text-gray-800 truncate w-32">
                    {approver.name}
                  </span>
                  <span
                    className={`mt-1 text-xs font-medium ${
                      approver.status === 'approved'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {approver.status === 'approved' ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div>
        <div className="font-semibold text-gray-700 mb-2 text-lg">
          Reimbursement Details
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500">Type</div>
            <div className="font-medium text-gray-900">{data.type}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Employee</div>
            <div className="font-medium text-gray-900">{data.madeBy}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Merchant</div>
            <div className="font-medium text-gray-900">{data.merchant}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Date</div>
            <div className="font-medium text-gray-900">{data.date}</div>
          </div>
        </div>
      </div>

      {/* Receipts at the very bottom */}
      {data.receiptFiles &&
        Array.isArray(data.receiptFiles) &&
        data.receiptFiles.length > 0 && (
          <div>
            <div className="font-semibold text-gray-700 mb-2">Receipts</div>
            <div className="flex flex-wrap gap-3">
              {data.receiptFiles.map((file: any, idx: number) => (
                <div
                  key={idx}
                  className="border rounded p-2 bg-gray-50 flex flex-col items-center w-28"
                >
                  {/* If file is an image, show preview, else show file name */}
                  {file.type && file.type.startsWith('image') ? (
                    <img
                      src={file.url || URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-20 h-20 object-cover rounded mb-1"
                    />
                  ) : (
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded mb-1 text-xs text-gray-500">
                      <span className="truncate">
                        {file.name ||
                          (typeof file === 'string' ? file : 'File')}
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-gray-700 truncate w-full text-center">
                    {file.name || (typeof file === 'string' ? file : 'File')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default ReimbursementDetails;
