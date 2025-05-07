// components/spend-policy/approval-rule-form/review-step.tsx (continued)
import { Check, Bell, CheckCircle2 } from "lucide-react";
import { useFieldConfig } from "../hooks/use-field-config";
import {
    ApprovalRuleData,
    ConditionGroup,
    ApproverGroup,
    SubmissionRequirements,
    MileageRequirements
} from "../utils/types";
import { cn } from "@potta/lib/utils";

type ReviewStepProps = {
    ruleName: string;
    transactionType: string;
    conditionGroups: ConditionGroup[];
    approverGroups: ApproverGroup[];
    submissionRequirements?: SubmissionRequirements;
    mileageRequirements?: MileageRequirements;
    summaryOnly?: boolean; // Show only the summary without headers
    conditionsOnly?: boolean; // Show only conditions
    approversOnly?: boolean; // Show only approvers
};

export function ReviewStep({
    ruleName,
    transactionType,
    conditionGroups,
    approverGroups,
    submissionRequirements,
    mileageRequirements,
    summaryOnly = false,
    conditionsOnly = false,
    approversOnly = false
}: ReviewStepProps) {
    const {
        transactionFields,
        getOperatorsForField,
        getValueOptionsForField,
        shouldUseMultiSelectForValue
    } = useFieldConfig(transactionType);

    // Transaction type options
    const transactionTypes = [
        { value: "expenses", label: "Expenses (card transactions and reimbursements)" },
        { value: "spendRequests", label: "Spend Requests (cards and purchase orders/terminals)" },
        { value: "bills", label: "Bills (bill payment approvals)" },
        { value: "vendors", label: "Vendors (vendor change approvals)" }
    ];

    // Approver types
    const approverTypes = [
        { value: "user", label: "Specific User" },
        { value: "role", label: "Role" },
        { value: "department", label: "Department" },
        { value: "manager", label: "Manager" }
    ];

    // Sample approver options by type
    const approverOptionsByType: Record<string, Array<{ value: string, label: string }>> = {
        user: [
            { value: "user-1", label: "John Smith" },
            { value: "user-2", label: "Jane Doe" },
            { value: "user-3", label: "Michael Johnson" },
            { value: "user-4", label: "Sarah Williams" }
        ],
        role: [
            { value: "role-1", label: "Finance Manager" },
            { value: "role-2", label: "Department Head" },
            { value: "role-3", label: "Executive" },
            { value: "role-4", label: "Team Lead" }
        ],
        department: [
            { value: "dept-1", label: "Accounting Department" },
            { value: "dept-2", label: "Marketing Department" },
            { value: "dept-3", label: "Operations Department" },
            { value: "dept-4", label: "IT Department" }
        ],
        manager: [
            { value: "manager-1", label: "Direct Manager" },
            { value: "manager-2", label: "Department Manager" },
            { value: "manager-3", label: "Senior Manager" }
        ]
    };

    // Additional fields options
    const additionalFieldOptions = [
        { value: "projectCode", label: "Project Code" },
        { value: "costCenter", label: "Cost Center" },
        { value: "accountingCode", label: "Accounting Code" },
        { value: "clientReference", label: "Client Reference" }
    ];

    // Helper function to get transaction type label
    const getTransactionTypeLabel = (type: string) => {
        const transType = transactionTypes.find(t => t.value === type);
        return transType?.label || type;
    };

    // Helper function to get field label
    const getFieldLabel = (field: string) => {
        const fieldItem = transactionFields.find(f => f.value === field);
        return fieldItem?.label || field;
    };

    // Helper function to get operator label
    const getOperatorLabel = (field: string, operator: string) => {
        const operatorItem = getOperatorsForField(field).find(o => o.value === operator);
        return operatorItem?.label || operator;
    };

    // Helper function to get value label
    const getValueLabel = (field: string, value: string | string[]) => {
        if (Array.isArray(value)) {
            return value.map(v => {
                const option = getValueOptionsForField(field, '').find(o => o.value === v);
                return option?.label || v;
            }).join(", ");
        }

        const option = getValueOptionsForField(field, '').find(o => o.value === value);
        return option?.label || value;
    };

    // Helper function to get approver label
    const getApproverLabel = (type: string, value: string) => {
        const options = approverOptionsByType[type] || [];
        const option = options.find(o => o.value === value);
        return option?.label || value;
    };

    // Helper function to get approver type label
    const getApproverTypeLabel = (type: string) => {
        const approverType = approverTypes.find(t => t.value === type);
        return approverType?.label || type;
    };

    // Helper function to get additional field label
    const getAdditionalFieldLabel = (fieldValue: string) => {
        const field = additionalFieldOptions.find(f => f.value === fieldValue);
        return field?.label || fieldValue;
    };

    return (
        <div className={cn("space-y-8", summaryOnly && "space-y-2")}>
            {!summaryOnly && (
                <div className="bg-muted/30 p-6 rounded-md">
                    <h3 className="text-sm font-medium mb-4">Policy Summary</h3>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Policy Name</p>
                            <p className="text-sm text-muted-foreground">{ruleName || "Unnamed Policy"}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium">Transaction Type</p>
                            <p className="text-sm text-muted-foreground">{getTransactionTypeLabel(transactionType)}</p>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full border border-muted-foreground/30 text-xs mt-0.5">
                                1
                            </div>
                            <div>
                                <p className="font-medium text-sm">When</p>
                                {conditionGroups.some(g => g.conditions.some(c => c.field && c.operator)) ? (
                                    <div className="mt-2 space-y-2 text-sm">
                                        {conditionGroups.map((group, groupIndex) => (
                                            <div key={group.id}>
                                                {groupIndex > 0 && (
                                                    <div className="font-medium text-muted-foreground my-1">OR</div>
                                                )}
                                                <ul className="space-y-1">
                                                    {group.conditions.map((condition, condIndex) => (
                                                        condition.field && condition.operator ? (
                                                            <li key={condition.id} className="text-muted-foreground">
                                                                {condIndex > 0 ? "And " : ""}
                                                                {getFieldLabel(condition.field)}
                                                                {" "}
                                                                {getOperatorLabel(condition.field, condition.operator)}
                                                                {" "}
                                                                {shouldUseMultiSelectForValue(condition.field, condition.operator) && Array.isArray(condition.value)
                                                                    ? getValueLabel(condition.field, condition.value)
                                                                    : getValueLabel(condition.field, condition.value.toString())}
                                                            </li>
                                                        ) : null
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground mt-2">No conditions defined</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs mt-0.5">
                                2
                            </div>
                            <div>
                                <p className="font-medium text-sm">Actions</p>
                                {approverGroups.some(g => g.approvers.some(a => a.type && a.value)) ? (
                                    <div className="mt-2 space-y-2 text-sm">
                                        {approverGroups.map((group, groupIndex) => (
                                            <div key={group.id}>
                                                {groupIndex > 0 && (
                                                    <div className="font-medium text-muted-foreground my-1">
                                                        {group.type === 'AND' ? 'AND' : 'OR'}
                                                    </div>
                                                )}
                                                <ul className="space-y-1">
                                                    {group.approvers.map((approver, approverIndex) => (
                                                        approver.type && approver.value ? (
                                                            <li key={approver.id} className="text-muted-foreground flex items-center space-x-2">
                                                                {approverIndex > 0 && (
                                                                    <span className="mr-1">And</span>
                                                                )}
                                                                {approver.actionType === 'approval' ? (
                                                                    <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                                                                ) : (
                                                                    <Bell className="h-3 w-3 text-muted-foreground" />
                                                                )}
                                                                <span>
                                                                    {approver.actionType === 'approval' ? 'Request approval from ' : 'Notify '}
                                                                    {approver.type === 'manager'
                                                                        ? getApproverLabel(approver.type, approver.value)
                                                                        : `${getApproverTypeLabel(approver.type)}: ${getApproverLabel(approver.type, approver.value)}`}
                                                                </span>
                                                            </li>
                                                        ) : null
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground mt-2">No actions defined</p>
                                )}
                            </div>
                        </div>

                        {submissionRequirements && (
                            <div className="flex items-start space-x-3">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs mt-0.5">
                                    3
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Submission Requirements</p>
                                    <div className="mt-2 space-y-2 text-sm">
                                        <ul className="space-y-1">
                                            {submissionRequirements.receiptsRequired && (
                                                <li className="text-muted-foreground flex items-center">
                                                    <Check className="h-3 w-3 mr-2" /> Receipts Required
                                                </li>
                                            )}
                                            {submissionRequirements.memoRequired && (
                                                <li className="text-muted-foreground flex items-center">
                                                    <Check className="h-3 w-3 mr-2" /> Memo Required
                                                </li>
                                            )}
                                            {submissionRequirements.screenshotsRequired && (
                                                <li className="text-muted-foreground flex items-center">
                                                    <Check className="h-3 w-3 mr-2" /> Screenshots Required
                                                </li>
                                            )}
                                            {submissionRequirements.additionalFields.length > 0 && (
                                                <li className="text-muted-foreground">
                                                    <div className="flex items-center">
                                                        <Check className="h-3 w-3 mr-2" /> Additional Fields Required:
                                                    </div>
                                                    <ul className="ml-5 mt-1">
                                                        {submissionRequirements.additionalFields.map(field => (
                                                            <li key={field} className="text-muted-foreground">
                                                                • {getAdditionalFieldLabel(field)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {mileageRequirements && (
                            <div className="flex items-start space-x-3">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs mt-0.5">
                                    4
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Mileage Requirements</p>
                                    <div className="mt-2 space-y-2 text-sm">
                                        <ul className="space-y-1">
                                            {mileageRequirements.odometerScreenshots && (
                                                <li className="text-muted-foreground flex items-center">
                                                    <Check className="h-3 w-3 mr-2" /> Odometer Screenshots Required
                                                </li>
                                            )}
                                            {mileageRequirements.gpsTracking && (
                                                <li className="text-muted-foreground flex items-center">
                                                    <Check className="h-3 w-3 mr-2" /> GPS Tracking Required
                                                </li>
                                            )}
                                            {mileageRequirements.businessPurpose && (
                                                <li className="text-muted-foreground flex items-center">
                                                    <Check className="h-3 w-3 mr-2" /> Business Purpose Description Required
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
    )
}

{/* Conditional rendering based on props */ }
{
    (summaryOnly && conditionsOnly) && (
        <div className="mt-2 space-y-1 text-sm">
            {conditionGroups.some(g => g.conditions.some(c => c.field && c.operator)) ? (
                <div>
                    {conditionGroups.map((group, groupIndex) => (
                        <div key={group.id}>
                            {groupIndex > 0 && (
                                <div className="font-medium text-muted-foreground my-1">OR</div>
                            )}
                            <ul className="space-y-1">
                                {group.conditions.map((condition, condIndex) => (
                                    condition.field && condition.operator ? (
                                        <li key={condition.id} className="text-muted-foreground">
                                            {condIndex > 0 ? "And " : ""}
                                            {getFieldLabel(condition.field)}
                                            {" "}
                                            {getOperatorLabel(condition.field, condition.operator)}
                                            {" "}
                                            {shouldUseMultiSelectForValue(condition.field, condition.operator) && Array.isArray(condition.value)
                                                ? getValueLabel(condition.field, condition.value)
                                                : getValueLabel(condition.field, condition.value.toString())}
                                        </li>
                                    ) : null
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground mt-2">No conditions defined</p>
            )}
        </div>
    )
}

{
    (summaryOnly && approversOnly) && (
        <div className="mt-2 space-y-1 text-sm">
            {approverGroups.some(g => g.approvers.some(a => a.type && a.value)) ? (
                <div>
                    {approverGroups.map((group, groupIndex) => (
                        <div key={group.id}>
                            {groupIndex > 0 && (
                                <div className="font-medium text-muted-foreground my-1">
                                    {group.type === 'AND' ? 'AND' : 'OR'}
                                </div>
                            )}
                            <ul className="space-y-1">
                                {group.approvers.map((approver, approverIndex) => (
                                    approver.type && approver.value ? (
                                        <li key={approver.id} className="text-muted-foreground">
                                            {approverIndex > 0 && (
                                                <span className="mr-1">And</span>
                                            )}
                                            {getApproverTypeLabel(approver.type)}:
                                            {" "}
                                            {getApproverLabel(approver.type, approver.value)}
                                        </li>
                                    ) : null
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground mt-2">No approvers defined</p>
            )}
        </div>
    )
}
      </div >
    );
  }

