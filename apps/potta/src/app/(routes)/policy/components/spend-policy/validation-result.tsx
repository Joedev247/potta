// components/spend-policy/validation-result.tsx
import { 
    AlertCircle, 
    CheckCircle2, 
    AlertTriangle, 
    Users, 
    Bell 
  } from "lucide-react";
  import { Alert, AlertDescription, AlertTitle } from "@potta/components/shadcn/alert";
  import { Badge } from "@potta/components/shadcn/badge";
  
  type ValidationResultProps = {
    result: {
      isValid: boolean;
      requiredApprovals: string[];
      notifications: string[];
      errors: string[];
    };
  };
  
  export function ValidationResult({ result }: ValidationResultProps) {
    const { isValid, requiredApprovals, notifications, errors } = result;
    
    return (
      <div className="space-y-4">
        <Alert 
          variant={isValid ? "default" : "destructive"}
          className={isValid ? "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-400" : ""}
        >
          {isValid ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {isValid ? "Transaction Valid" : "Validation Failed"}
          </AlertTitle>
          <AlertDescription>
            {isValid 
              ? "This transaction complies with all applicable policies."
              : "This transaction violates one or more policies."}
          </AlertDescription>
        </Alert>
        
        {requiredApprovals.length > 0 && (
          <Alert>
            <Users className="h-4 w-4" />
            <AlertTitle>Approval Required</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>This transaction requires approval from:</p>
              <div className="flex flex-wrap gap-2">
                {requiredApprovals.map((approver, index) => (
                  <Badge key={index} variant="outline">
                    {approver}
                  </Badge>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {notifications.length > 0 && (
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertTitle>Notifications</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>The following will be notified:</p>
              <div className="flex flex-wrap gap-2">
                {notifications.map((recipient, index) => (
                  <Badge key={index} variant="outline">
                    {recipient}
                  </Badge>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Policy Violations</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }
  