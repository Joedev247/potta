import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@potta/components/shadcn/dialog';
import { Button } from '@potta/components/shadcn/button';
import { Input } from '@potta/components/shadcn/input';
import { Label } from '@potta/components/shadcn/label';
import { Textarea } from '@potta/components/shadcn/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@potta/components/shadcn/select';
import toast from 'react-hot-toast';

interface LineItem {
  uuid: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number | null;
  discountType: string;
  discountCap: number;
}

interface Invoice {
  uuid: string;
  invoiceId: string;
  issuedDate: string;
  dueDate: string;
  invoiceType: string;
  invoiceTotal: number;
  status: string;
  notes: string;
  currency: string;
  taxRate: number;
  taxAmount: number;
  paymentMethod: string;
  billingAddress: string;
  shippingAddress: string;
  paymentTerms: string;
  paymentReference: string;
  lineItems: LineItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface EditInvoiceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  invoice: Invoice | null;
}

const EditInvoiceModal: React.FC<EditInvoiceModalProps> = ({
  open,
  setOpen,
  invoice,
}) => {
  const [formData, setFormData] = useState({
    invoiceType: '',
    invoiceTotal: '',
    notes: '',
    issuedDate: '',
    dueDate: '',
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceType: invoice.invoiceType || '',
        invoiceTotal: invoice.invoiceTotal.toString(),
        notes: invoice.notes || '',
        issuedDate: invoice.issuedDate
          ? new Date(invoice.issuedDate).toISOString().split('T')[0]
          : '',
        dueDate: invoice.dueDate
          ? new Date(invoice.dueDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [invoice]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!invoice) return;

    const loadingToast = toast.loading('Updating invoice...');
    try {
      // TODO: Implement update API call
      console.log('Updating invoice:', invoice.uuid, formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Invoice updated successfully!', { id: loadingToast });
      setOpen(false);
    } catch (error) {
      console.error('Failed to update invoice:', error);
      toast.error('Failed to update invoice. Please try again.', {
        id: loadingToast,
      });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
          <DialogDescription>
            Update invoice details for {invoice.invoiceId}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceType">Invoice Type</Label>
              <Select
                value={formData.invoiceType}
                onValueChange={(value) =>
                  handleInputChange('invoiceType', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select invoice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="credit_note">Credit Note</SelectItem>
                  <SelectItem value="debit_note">Debit Note</SelectItem>
                  <SelectItem value="receipt">Receipt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceTotal">Amount (XAF)</Label>
              <Input
                id="invoiceTotal"
                type="number"
                value={formData.invoiceTotal}
                onChange={(e) =>
                  handleInputChange('invoiceTotal', e.target.value)
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issuedDate">Issue Date</Label>
              <Input
                id="issuedDate"
                type="date"
                value={formData.issuedDate}
                onChange={(e) =>
                  handleInputChange('issuedDate', e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Enter invoice notes..."
              rows={3}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Customer Information
            </h4>
            <div className="text-sm text-gray-600">
              <p>
                <strong>Name:</strong> {invoice.customer.firstName}{' '}
                {invoice.customer.lastName}
              </p>
              <p>
                <strong>Invoice ID:</strong> {invoice.invoiceId}
              </p>
              <p>
                <strong>Status:</strong> {invoice.status}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInvoiceModal;
