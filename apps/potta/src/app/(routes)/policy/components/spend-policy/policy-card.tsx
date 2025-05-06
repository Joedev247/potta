// components/spend-policy/policy-card.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@potta/components/shadcn/card";
import { Badge } from "@potta/components/shadcn/badge";
import { FileText, Car, Plane, Users } from "lucide-react";
import { format } from "date-fns";

type PolicyCardProps = {
  policy: {
    id: string;
    name: string;
    type: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    rulesCount?: number;
    requiresApproval?: boolean;
  };
  onClick?: () => void;
};

export function PolicyCard({ policy, onClick }: PolicyCardProps) {
  const getIcon = () => {
    switch (policy.type) {
      case "mileage":
        return <Car className="h-4 w-4" />;
      case "travel":
        return <Plane className="h-4 w-4" />;
      case "approval":
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <Card 
      className={onClick ? "hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors" : ""}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{policy.name}</CardTitle>
          <Badge variant="outline" className="capitalize flex items-center gap-1">
            {getIcon()}
            {policy.type}
          </Badge>
        </div>
        <CardDescription>
          {policy.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          {policy.rulesCount !== undefined && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Rules:</span> {policy.rulesCount}
            </div>
          )}
          {policy.requiresApproval !== undefined && (
            <div className="flex items-center gap-2 mt-1">
              <span className="font-medium">Approval:</span> {policy.requiresApproval ? "Required" : "Not required"}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Last updated: {format(policy.updatedAt, "PPP")}
      </CardFooter>
    </Card>
  );
}
