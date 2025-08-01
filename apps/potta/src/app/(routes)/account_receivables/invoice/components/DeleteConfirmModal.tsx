import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@potta/components/shadcn/dialog';
import { Button } from '@potta/components/shadcn/button';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  invoiceId: string;
  customerName: string;
  amount: number;
  isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  setOpen,
  onConfirm,
  invoiceId,
  customerName,
  amount,
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Invoice
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this invoice? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Invoice ID:
                </span>
                <span className="text-sm text-gray-900">{invoiceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Customer:
                </span>
                <span className="text-sm text-gray-900">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Amount:
                </span>
                <span className="text-sm text-gray-900">
                  XAF {amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Invoice
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;
