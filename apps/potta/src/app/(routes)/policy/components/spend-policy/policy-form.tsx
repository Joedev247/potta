// components/spend-policy/policy-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@potta/components/shadcn/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@potta/components/shadcn/card";
import { Input } from "@potta/components/shadcn/input";
import { Label } from "@potta/components/shadcn/label";
import { Textarea } from "@potta/components/shadcn/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@potta/components/shadcn/select";
import { Switch } from "@potta/components/shadcn/switch";
import { RuleBuilder } from "./rule-builder";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const steps = [
  "Basic Details",
  "Submission Requirements",
  "Rules",
  "Actions",
  "Review"
];

type PolicyFormProps = {
  onSubmit?: (policyData: any) => void;
  initialData?: any;
};

export function PolicyForm({ onSubmit, initialData = {} }: PolicyFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [policyData, setPolicyData] = useState({
    name: initialData.name || "",
    type: initialData.type || "general",
    description: initialData.description || "",
    requireReceipt: initialData.requireReceipt !== undefined ? initialData.requireReceipt : true,
    requireMemo: initialData.requireMemo !== undefined ? initialData.requireMemo : false,
    requireScreenshots: initialData.requireScreenshots !== undefined ? initialData.requireScreenshots : false,
    additionalRequirements: initialData.additionalRequirements || [],
    rules: initialData.rules || []
  });
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (onSubmit) {
      onSubmit(policyData);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex space-x-2 mb-8">
        {steps.map((step, index) => (
          <div 
            key={step} 
            className={`flex items-center ${
              index > 0 ? "ml-2" : ""
            }`}
          >
            <div 
              className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium ${
                currentStep === index 
                  ? "bg-primary text-primary-foreground" 
                  : currentStep > index 
                    ? "bg-primary/20 text-primary" 
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > index ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span 
              className={`ml-2 text-sm font-medium ${
                currentStep === index 
                  ? "text-primary" 
                  : "text-muted-foreground"
              }`}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className="ml-2 h-px w-8 bg-muted-foreground/30" />
            )}
          </div>
        ))}
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Policy Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter policy name" 
                  value={policyData.name}
                  onChange={(e) => setPolicyData({...policyData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Policy Type</Label>
                <Select 
                  value={policyData.type}
                  onValueChange={(value) => setPolicyData({...policyData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select policy type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="mileage">Mileage</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter policy description"
                  value={policyData.description}
                  onChange={(e) => setPolicyData({...policyData, description: e.target.value})}
                />
              </div>
            </div>
          )}
          
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="receipt">Require Receipt</Label>
                  <p className="text-sm text-muted-foreground">
                    Transactions will require a receipt to be uploaded
                  </p>
                </div>
                <Switch 
                  id="receipt"
                  checked={policyData.requireReceipt}
                  onCheckedChange={(checked) => setPolicyData({...policyData, requireReceipt: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="memo">Require Memo</Label>
                  <p className="text-sm text-muted-foreground">
                    Transactions will require a memo explaining the purpose
                  </p>
                </div>
                <Switch 
                  id="memo"
                  checked={policyData.requireMemo}
                  onCheckedChange={(checked) => setPolicyData({...policyData, requireMemo: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="screenshots">Require Screenshots</Label>
                  <p className="text-sm text-muted-foreground">
                    Transactions will require supporting screenshots
                  </p>
                </div>
                <Switch 
                  id="screenshots"
                  checked={policyData.requireScreenshots}
                  onCheckedChange={(checked) => setPolicyData({...policyData, requireScreenshots: checked})}
                />
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Define Policy Rules</h3>
              <p className="text-sm text-muted-foreground">
                Create rules to determine when this policy applies
              </p>
              
              <RuleBuilder 
                rules={policyData.rules}
                onChange={(rules) => setPolicyData({...policyData, rules})}
              />
            </div>
          )}
          
          {/* Additional steps would be implemented here */}
          
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Review Policy</h3>
              <div className="rounded-md bg-muted p-4">
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium">Name:</dt>
                    <dd>{policyData.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Type:</dt>
                    <dd className="capitalize">{policyData.type}</dd>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <dt className="font-medium">Requirements:</dt>
                    <dd className="mt-1">
                      <ul className="list-disc list-inside space-y-1">
                        {policyData.requireReceipt && <li>Receipt required</li>}
                        {policyData.requireMemo && <li>Memo required</li>}
                        {policyData.requireScreenshots && <li>Screenshots required</li>}
                      </ul>
                    </dd>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <dt className="font-medium">Rules:</dt>
                    <dd className="mt-1">
                      {policyData.rules.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {policyData.rules.map((rule:any, i:any) => (
                            <li key={i}>Rule {i+1}: {rule.conditions?.length || 0} conditions</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No rules defined</p>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Create Policy
              <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
