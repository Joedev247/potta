// components/spend-policy/approval-rule-form/basic-info-step.tsx
import { Input } from "@potta/components/shadcn/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@potta/components/shadcn/select";
 
type BasicInfoStepProps = {
  ruleName: string;
  setRuleName: (name: string) => void;
  transactionType: string;
  setTransactionType: (type: string) => void;
};

export function BasicInfoStep({ 
  ruleName, 
  setRuleName, 
  transactionType, 
  setTransactionType 
}: BasicInfoStepProps) {
  // Transaction type options
  const transactionTypes = [
    { value: "expenses", label: "Expenses (card transactions and reimbursements)" },
    { value: "spendRequests", label: "Spend Requests (cards and purchase orders/terminals)" },
    { value: "bills", label: "Bills (bill payment approvals)" },
    { value: "vendors", label: "Vendors (vendor change approvals)" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="rule-name" className="block text-sm font-medium mb-2">
          Rule name
        </label>
        <Input
          id="rule-name"
          placeholder="Enter policy name"
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="transaction-type" className="block text-sm font-medium mb-2">
          Transaction Type
        </label>
        <Select
          value={transactionType}
          onValueChange={setTransactionType}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select transaction type" />
          </SelectTrigger>
          <SelectContent>
            {transactionTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2">
          Select which type of transaction this policy applies to.
        </p>
      </div>
    </div>
  );
}
