'use client';
import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  CreditCard,
  Smartphone,
  DollarSign,
  CheckCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@potta/components/button';
import Input from '@potta/components/input';

interface PaymentModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedInvoice: any;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  setIsOpen,
  selectedInvoice,
}) => {
  // State for modal visibility to handle animations
  const [isVisible, setIsVisible] = useState(isOpen);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const paymentMethods = [
    {
      id: 'mobile_money',
      name: 'MTN Mobile Money',
      icon: (
        <img src="/icons/mtn.svg" alt="MTN Mobile Money" className="w-6 h-6" />
      ),
      description: 'Pay with MTN Mobile Money',
      color: 'bg-green-50 border-green-200 text-green-700',
      hoverColor: 'hover:bg-green-100',
    },
    {
      id: 'orange_money',
      name: 'Orange Money',
      icon: <img src="/icons/om.svg" alt="Orange Money" className="w-6 h-6" />,
      description: 'Pay with Orange Money',
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      hoverColor: 'hover:bg-orange-100',
    },
    {
      id: 'check',
      name: 'Check',
      icon: <DollarSign className="w-6 h-6" />,
      description: 'Pay with Check',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      hoverColor: 'hover:bg-blue-100',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Pay with Bank Transfer',
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      hoverColor: 'hover:bg-purple-100',
    },
  ];

  // Update visibility when isOpen prop changes
  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  // Handle smooth closing
  const handleClose = () => {
    setIsVisible(false);
    // Delay actual closing to allow animation to complete
    setTimeout(() => {
      setIsOpen(false);
      setIsSuccess(false);
      setPaymentMethod('');
      setPhoneNumber('');
      setAmount('');
    }, 300); // Match this with the exit animation duration
  };

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isProcessing]);

  const handlePayment = async () => {
    if (!paymentMethod || !phoneNumber || !amount) {
      alert('Please fill in all fields');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Close modal after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white w-full max-w-md h-screen overflow-y-auto shadow-lg"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
            onClick={(e) => e.stopPropagation()} // Prevent clicks from closing the modal
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold">
                {isSuccess ? 'Payment Successful' : 'Make Payment'}
              </h2>
              {!isSuccess && (
                <button
                  onClick={handleClose}
                  className="p-2"
                  disabled={isProcessing}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {isSuccess ? (
                // Success State
                <div className="flex flex-col items-center justify-center h-96">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Payment Completed Successfully
                  </h3>
                  <p className="text-gray-600 text-center">
                    Your payment of {formatCurrency(parseFloat(amount) || 0)}{' '}
                    has been processed.
                  </p>
                </div>
              ) : (
                // Payment Form
                <div className="space-y-6">
                  {/* Invoice Details */}
                  {selectedInvoice && (
                    <div className="bg-gray-50 p-4 ">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Invoice Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Invoice:</span>
                          <span className="font-medium">
                            {selectedInvoice.invoiceNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vendor:</span>
                          <span className="font-medium">
                            {selectedInvoice.beneficiary}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(selectedInvoice.amountInclTax)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Method Selection */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Select Payment Method
                    </h3>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`w-full p-4 border-2  flex items-center space-x-3 transition-colors ${
                            paymentMethod === method.id
                              ? `${method.color} border-current`
                              : 'border-gray-200 hover:border-gray-300'
                          } ${method.hoverColor}`}
                          disabled={isProcessing}
                        >
                          {method.icon}
                          <div className="text-left">
                            <div className="font-medium">{method.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Form */}
                  {paymentMethod && (
                    <div className="space-y-4">
                      {/* Mobile Money Fields */}
                      {(paymentMethod === 'mobile_money' ||
                        paymentMethod === 'orange_money') && (
                        <>
                          <Input
                            label="Phone Number"
                            type="tel"
                            name="phoneNumber"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onchange={(e) => setPhoneNumber(e.target.value)}
                            required
                            disabled={isProcessing}
                          />

                          <Input
                            label="Amount (XAF)"
                            type="number"
                            name="amount"
                            placeholder="0.00"
                            value={amount}
                            onchange={(e) => setAmount(e.target.value)}
                            step="0.01"
                            min="0"
                            required
                            disabled={isProcessing}
                          />

                          {/* Payment Instructions */}
                          <div className="p-4 bg-blue-50 ">
                            <h4 className="font-medium text-blue-900 mb-2">
                              Payment Instructions
                            </h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>
                                • Enter your phone number registered with{' '}
                                {paymentMethod === 'mobile_money'
                                  ? 'MTN Mobile Money'
                                  : 'Orange Money'}
                              </li>
                              <li>
                                • You will receive a payment prompt on your
                                phone
                              </li>
                              <li>
                                • Enter your PIN to complete the transaction
                              </li>
                              <li>• Payment will be processed immediately</li>
                            </ul>
                          </div>
                        </>
                      )}

                      {/* Check Fields */}
                      {paymentMethod === 'check' && (
                        <>
                          <Input
                            label="Check Number"
                            type="text"
                            name="checkNumber"
                            placeholder="Enter check number"
                            value={phoneNumber}
                            onchange={(e) => setPhoneNumber(e.target.value)}
                            required
                            disabled={isProcessing}
                          />

                          <Input
                            label="Amount (XAF)"
                            type="number"
                            name="amount"
                            placeholder="0.00"
                            value={amount}
                            onchange={(e) => setAmount(e.target.value)}
                            step="0.01"
                            min="0"
                            required
                            disabled={isProcessing}
                          />

                          <Input
                            label="Bank Name"
                            type="text"
                            name="bankName"
                            placeholder="Enter bank name"
                            value=""
                            onchange={() => {}}
                            required
                            disabled={isProcessing}
                          />

                          {/* Payment Instructions */}
                          <div className="p-4 bg-blue-50 ">
                            <h4 className="font-medium text-blue-900 mb-2">
                              Check Payment Instructions
                            </h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>• Enter the check number from your check</li>
                              <li>
                                • Provide the bank name that issued the check
                              </li>
                              <li>
                                • Payment will be processed within 2-3 business
                                days
                              </li>
                              <li>
                                • Ensure check is properly signed and dated
                              </li>
                            </ul>
                          </div>
                        </>
                      )}

                      {/* Bank Transfer Fields */}
                      {paymentMethod === 'bank_transfer' && (
                        <>
                          <Input
                            label="Account Number"
                            type="text"
                            name="accountNumber"
                            placeholder="Enter account number"
                            value={phoneNumber}
                            onchange={(e) => setPhoneNumber(e.target.value)}
                            required
                            disabled={isProcessing}
                          />

                          <Input
                            label="Amount (XAF)"
                            type="number"
                            name="amount"
                            placeholder="0.00"
                            value={amount}
                            onchange={(e) => setAmount(e.target.value)}
                            step="0.01"
                            min="0"
                            required
                            disabled={isProcessing}
                          />

                          <Input
                            label="Bank Name"
                            type="text"
                            name="bankName"
                            placeholder="Enter bank name"
                            value=""
                            onchange={() => {}}
                            required
                            disabled={isProcessing}
                          />

                          <Input
                            label="Reference Number"
                            type="text"
                            name="referenceNumber"
                            placeholder="Enter reference number"
                            value=""
                            onchange={() => {}}
                            required
                            disabled={isProcessing}
                          />

                          {/* Payment Instructions */}
                          <div className="p-4 bg-blue-50 ">
                            <h4 className="font-medium text-blue-900 mb-2">
                              Bank Transfer Instructions
                            </h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>• Enter your bank account number</li>
                              <li>• Provide the bank name for the transfer</li>
                              <li>• Include a reference number for tracking</li>
                              <li>
                                • Transfer will be processed within 1-2 business
                                days
                              </li>
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Action buttons - fixed at bottom */}
                  {paymentMethod && (
                    <div className="pt-2 flex pb-2 justify-end sticky bottom-0 bg-white w-full mt-8">
                      <Button
                        text={isProcessing ? 'Processing...' : 'Pay Now'}
                        type="button"
                        onClick={handlePayment}
                        disabled={isProcessing || !phoneNumber || !amount}
                        icon={<CreditCard className="h-4 w-4" />}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
