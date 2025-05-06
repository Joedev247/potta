// components/spend-policy/condition-builder.tsx
import { Button } from "@potta/components/shadcn/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@potta/components/shadcn/select";
import { Input } from "@potta/components/shadcn/input";
import { Trash2 } from "lucide-react";

type Condition = {
  id: string;
  criterionType: string;
  comparisonOperator: string;
  value: any;
};

type ConditionBuilderProps = {
  condition: Condition;
  onChange: (condition: Condition) => void;
  onRemove: () => void;
};

const criterionTypes = [
  { value: "AMOUNT", label: "Amount" },
  { value: "BUSINESS_ENTITY", label: "Business Entity" },
  { value: "DEPARTMENT", label: "Department" },
  { value: "LOCATION_BRANCH", label: "Location/Branch" },
  { value: "MATCHED_TO_PURCHASE_ORDER", label: "Matched to Purchase Order" },
  { value: "PAYMENT_TYPE", label: "Payment Type" },
  { value: "EXPENSE_CATEGORY", label: "Expense Category" },
  { value: "CUSTOMER", label: "Customer" },
  { value: "INVENTORY_ITEM", label: "Inventory Item" },
  { value: "VENDOR", label: "Vendor" },
];

const comparisonOperators = [
  { value: "EQUALS", label: "Equals" },
  { value: "NOT_EQUALS", label: "Not Equals" },
  { value: "GREATER_THAN", label: "Greater Than" },
  { value: "LESS_THAN", label: "Less Than" },
  { value: "IS", label: "Is" },
  { value: "IS_NOT", label: "Is Not" },
];

export function ConditionBuilder({ condition, onChange, onRemove }: ConditionBuilderProps) {
  const handleCriterionChange = (criterionType: string) => {
    onChange({
      ...condition,
      criterionType,
      // Reset value when changing criterion type
      value: criterionType === "MATCHED_TO_PURCHASE_ORDER" ? true : 
             (criterionType === "AMOUNT" ? 0 : "")
    });
  };
  
  const renderValueInput = () => {
    switch (condition.criterionType) {
      case "AMOUNT":
        return (
          <Input
            type="number"
            value={condition.value}
            onChange={(e) => onChange({ ...condition, value: parseFloat(e.target.value) })}
            className="w-full"
          />
        );
      case "MATCHED_TO_PURCHASE_ORDER":
        return (
          <Select
            value={condition.value ? "true" : "false"}
            onValueChange={(value) => onChange({ ...condition, value: value === "true" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            type="text"
            value={condition.value}
            onChange={(e) => onChange({ ...condition, value: e.target.value })}
            className="w-full"
          />
        );
    }
  };
  
  return (
    <div className="flex flex-wrap gap-2 items-center p-3 border rounded-md bg-background">
      <div className="flex-1 min-w-[180px]">
        <Select
          value={condition.criterionType}
          onValueChange={handleCriterionChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {criterionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 min-w-[180px]">
        <Select
          value={condition.comparisonOperator}
          onValueChange={(value) => onChange({ ...condition, comparisonOperator: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {comparisonOperators.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 min-w-[180px]">
        {renderValueInput()}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="flex-shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
