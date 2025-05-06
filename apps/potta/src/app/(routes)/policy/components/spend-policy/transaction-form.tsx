// components/spend-policy/transaction-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@potta/components/shadcn/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@potta/components/shadcn/card";
import { Input } from "@potta/components/shadcn/input";
import { Label } from "@potta/components/shadcn/label";
import { Textarea } from "@potta/components/shadcn/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@potta/components/shadcn/select";
import { ValidationResult } from "./validation-result";
import { Loader2, Upload } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@potta/components/shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@potta/components/shadcn/popover";
import { cn } from "@potta/lib/utils";

type TransactionFormProps = {
  onSubmit?: (transactionData: any) => void;
  onValidate?: (transactionData: any) => Promise<any>;
  initialData?: any;
};

export function TransactionForm({ onSubmit, onValidate, initialData = {} }: TransactionFormProps) {
  const [date, setDate] = useState<Date | undefined>(initialData.date || new Date());
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [transaction, setTransaction] = useState({
    amount: initialData.amount || "",
    description: initialData.description || "",
    category: initialData.category || "",
    paymentMethod: initialData.paymentMethod || "",
    vendor: initialData.vendor || "",
    receiptUrl: initialData.receiptUrl || "",
    memo: initialData.memo || "",
    screenshots: initialData.screenshots || [],
  });
  
  const handleInputChange = (field: string, value: string) => {
    setTransaction({ ...transaction, [field]: value });
  };
  
  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    // In a real app, you would upload the file to a server and get a URL back
    // For this example, we'll just use a placeholder URL
    if (field === "screenshots") {
      setTransaction({
        ...transaction,
        screenshots: [...transaction.screenshots, "https://example.com/screenshot.jpg"],
      });
    } else {
      setTransaction({
        ...transaction,
        [field]: "https://example.com/receipt.jpg",
      });
    }
  };
  
  const validateTransaction = async () => {
    setIsValidating(true);
    
    try {
      if (onValidate) {
        const result = await onValidate({
          ...transaction,
          date
        });
        setValidationResult(result);
      } else {
        // Simulate validation result if no onValidate function is provided
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setValidationResult({
          isValid: Math.random() > 0.3,
          requiredApprovals: Math.random() > 0.5 ? ["John Doe", "Jane Smith"] : [],
          notifications: Math.random() > 0.7 ? ["Finance Department"] : [],
          errors: Math.random() > 0.7 ? ["Receipt is required for expenses over $100"] : [],
        });
      }
    } catch (error) {
      console.error("Error validating transaction:", error);
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleSubmit = async () => {
    if (onSubmit) {
      onSubmit({
        ...transaction,
        date
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex">
                <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted">
                  $
                </div>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="rounded-l-none"
                  value={transaction.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                />
              </div>
            </div>
            
            // Continuing components/spend-policy/transaction-form.tsx
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={transaction.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meals">Meals & Entertainment</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="office">Office Supplies</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={transaction.paymentMethod}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creditCard">Company Credit Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="personalCard">Personal Card</SelectItem>
                  <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                placeholder="Enter vendor name"
                value={transaction.vendor}
                onChange={(e) => handleInputChange("vendor", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter transaction description"
                value={transaction.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Supporting Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receipt">Receipt</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="receipt-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                  </div>
                  <input
                    id="receipt-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload("receiptUrl", e.target.files)}
                  />
                </label>
              </div>
              {transaction.receiptUrl && (
                <div className="text-sm text-muted-foreground">
                  Receipt uploaded successfully
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="memo">Memo</Label>
              <Textarea
                id="memo"
                placeholder="Enter additional details about this transaction"
                value={transaction.memo}
                onChange={(e) => handleInputChange("memo", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="screenshots">Screenshots</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="screenshots-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                  </div>
                  <input
                    id="screenshots-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload("screenshots", e.target.files)}
                  />
                </label>
              </div>
              {transaction.screenshots.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {transaction.screenshots.length} screenshot(s) uploaded
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 border-t p-6">
            <Button
              variant="outline"
              onClick={validateTransaction}
              disabled={isValidating}
            >
              {isValidating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Validate
            </Button>
            <Button onClick={handleSubmit} disabled={isValidating}>
              Submit Transaction
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {validationResult && (
        <ValidationResult result={validationResult} />
      )}
    </div>
  );
}

