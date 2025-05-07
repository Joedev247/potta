// components/spend-policy/approval-rule-form/requirements-step.tsx
import { Checkbox } from "@potta/components/shadcn/checkbox";
import { Label } from "@potta/components/shadcn/label";
import { SubmissionRequirements, MileageRequirements } from "../utils/types";
import { cn } from "@potta/lib/utils";

type RequirementsStepProps = {
  submissionRequirements: SubmissionRequirements;
  setSubmissionRequirements: (requirements: SubmissionRequirements) => void;
  mileageRequirements: MileageRequirements;
  setMileageRequirements: (requirements: MileageRequirements) => void;
  showMileageRequirements: boolean;
  simplified?: boolean;
};

export function RequirementsStep({
  submissionRequirements,
  setSubmissionRequirements,
  mileageRequirements,
  setMileageRequirements,
  showMileageRequirements,
  simplified = false
}: RequirementsStepProps) {

  const toggleMainRequirement = (field: keyof Omit<SubmissionRequirements, 'additionalFields' | 'requireNetSuiteCustomerJob'>) => {
    setSubmissionRequirements({
      ...submissionRequirements,
      [field]: !submissionRequirements[field]
    });
  };
   const toggleNetSuiteRequirement = () => {
    setSubmissionRequirements({
      ...submissionRequirements,
      requireNetSuiteCustomerJob: !submissionRequirements.requireNetSuiteCustomerJob
    });
  };

  const toggleMileageRequirement = (field: keyof MileageRequirements) => {
    setMileageRequirements({ ...mileageRequirements, [field]: !mileageRequirements[field] });
  };

  return (
    // The outer div handles the overall structure (title for non-simplified, etc.)
    // The inner div for "Documentation Requirements" always gets a border in simplified mode.
    <div className={cn("space-y-4", !simplified && "border border-muted rounded-md p-4")}>
      {!simplified && (
        <div>
          <h3 className="text-sm font-medium mb-1">Submission Requirements</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Define what documentation and information is required.
          </p>
        </div>
      )}

      {/* This div ensures the "Documentation Requirements" section is visually grouped, especially in simplified mode */}
      <div className={cn("space-y-4", (simplified || !simplified) && "border border-muted rounded-md p-4")}>
        <h4 className="text-sm font-medium">Documentation Requirements</h4>
        <div className="space-y-2">
          {[
            { id: "receipts-required", label: "Receipts Required", field: "receiptsRequired" as const },
            { id: "memo-required", label: "Memo Required", field: "memoRequired" as const },
            { id: "screenshots-required", label: "Screenshots Required", field: "screenshotsRequired" as const },
          ].map(req => (
            <div key={req.id} className="flex items-center space-x-2">
              <Checkbox
                id={req.id}
                checked={submissionRequirements[req.field]}
                onCheckedChange={() => toggleMainRequirement(req.field)}
              />
              <Label htmlFor={req.id}>{req.label}</Label>
            </div>
          ))}
           <div className="flex items-center space-x-2">
            <Checkbox
              id="netsuite-customer-job"
              checked={!!submissionRequirements.requireNetSuiteCustomerJob}
              onCheckedChange={toggleNetSuiteRequirement}
            />
            <Label htmlFor="netsuite-customer-job">Require NetSuite Customer/Job</Label>
          </div>
        </div>
      </div>

      {showMileageRequirements && (
        <div className="space-y-4 border border-muted rounded-md p-4">
          <h4 className="text-sm font-medium">Mileage Specific Requirements</h4>
           <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="odometer-screenshots"
                checked={mileageRequirements.odometerScreenshots}
                onCheckedChange={() => toggleMileageRequirement('odometerScreenshots')}
              />
              <Label htmlFor="odometer-screenshots">Odometer Screenshots Required</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gps-tracking"
                checked={mileageRequirements.gpsTracking}
                onCheckedChange={() => toggleMileageRequirement('gpsTracking')}
              />
              <Label htmlFor="gps-tracking">GPS Tracking Required</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="business-purpose"
                checked={mileageRequirements.businessPurpose}
                onCheckedChange={() => toggleMileageRequirement('businessPurpose')}
              />
              <Label htmlFor="business-purpose">Business Purpose Description Required</Label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}