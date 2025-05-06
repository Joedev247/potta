// components/spend-policy/mileage-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@potta/components/shadcn/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@potta/components/shadcn/card";
import { Input } from "@potta/components/shadcn/input";
import { Label } from "@potta/components/shadcn/label";
import { Textarea } from "@potta/components/shadcn/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@potta/components/shadcn/popover";
import { Calendar } from "@potta/components/shadcn/calendar";
import { format } from "date-fns";
import { cn } from "@potta/lib/utils";
import { Upload, MapPin, Loader2 } from "lucide-react";
import { ValidationResult } from "./validation-result";

type MileageFormProps = {
  onSubmit?: (mileageData: any) => void;
  onValidate?: (mileageData: any) => Promise<any>;
  initialData?: any;
  reimbursementRate?: number;
};

export function MileageForm({ onSubmit, onValidate, initialData = {}, reimbursementRate = 0.58 }: MileageFormProps) {
  const [date, setDate] = useState<Date | undefined>(initialData.date || new Date());
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [reimbursement, setReimbursement] = useState({
    startLocation: initialData.startLocation || "",
    endLocation: initialData.endLocation || "",
    distance: initialData.distance || "",
    purpose: initialData.purpose || "",
    startGpsCoordinates: initialData.startGpsCoordinates || "",
    endGpsCoordinates: initialData.endGpsCoordinates || "",
    beforeScreenshotUrl: initialData.beforeScreenshotUrl || "",
    afterScreenshotUrl: initialData.afterScreenshotUrl || "",
  });
  
  const handleInputChange = (field: string, value: string) => {
    setReimbursement({ ...reimbursement, [field]: value });
  };
  
  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    // In a real app, you would upload the file to a server and get a URL back
    // For this example, we'll just use a placeholder URL
    setReimbursement({
      ...reimbursement,
      [field]: "https://example.com/screenshot.jpg",
    });
  };
  
  const getCurrentLocation = async (field: "startGpsCoordinates" | "endGpsCoordinates") => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          setReimbursement({
            ...reimbursement,
            [field]: coords,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  
  const validateReimbursement = async () => {
    setIsValidating(true);
    
    try {
      if (onValidate) {
        const result = await onValidate({
          ...reimbursement,
          date
        });
        setValidationResult(result);
      } else {
        // Simulate validation result if no onValidate function is provided
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setValidationResult({
          isValid: Math.random() > 0.3,
          requiredApprovals: ["Department Manager"],
          notifications: ["Finance Department"],
          errors: Math.random() > 0.7 ? ["GPS coordinates are required"] : [],
        });
      }
    } catch (error) {
      console.error("Error validating reimbursement:", error);
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleSubmit = async () => {
    if (onSubmit) {
      onSubmit({
        ...reimbursement,
        date,
        reimbursementAmount: reimbursement.distance 
          ? (parseFloat(reimbursement.distance) * reimbursementRate)
          : 0
      });
    }
  };
  
  // Calculate reimbursement amount
  const reimbursementAmount = reimbursement.distance 
    ? (parseFloat(reimbursement.distance) * reimbursementRate).toFixed(2)
    : "0.00";
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="purpose">Business Purpose</Label>
              <Textarea
                id="purpose"
                placeholder="Describe the business purpose of this trip"
                value={reimbursement.purpose}
                onChange={(e) => handleInputChange("purpose", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startLocation">Start Location</Label>
              <div className="flex space-x-2">
                <Input
                  id="startLocation"
                  placeholder="Enter starting location"
                  value={reimbursement.startLocation}
                  onChange={(e) => handleInputChange("startLocation", e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => getCurrentLocation("startGpsCoordinates")}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              {reimbursement.startGpsCoordinates && (
                <p className="text-xs text-muted-foreground">
                  GPS: {reimbursement.startGpsCoordinates}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endLocation">End Location</Label>
              <div className="flex space-x-2">
                <Input
                  id="endLocation"
                  placeholder="Enter ending location"
                  value={reimbursement.endLocation}
                  onChange={(e) => handleInputChange("endLocation", e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => getCurrentLocation("endGpsCoordinates")}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              {reimbursement.endGpsCoordinates && (
                <p className="text-xs text-muted-foreground">
                  GPS: {reimbursement.endGpsCoordinates}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distance">Distance (miles)</Label>
              <Input
                id="distance"
                type="number"
                placeholder="0.0"
                value={reimbursement.distance}
                onChange={(e) => handleInputChange("distance", e.target.value)}
              />
            </div>
            
            <div className="rounded-md bg-muted p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Reimbursement Rate</p>
                  <p className="text-sm text-muted-foreground">${reimbursementRate}/mile</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-2xl font-bold">${reimbursementAmount}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Supporting Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="beforeScreenshot">Starting Odometer</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="before-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> odometer photo
                    </p>
                  </div>
                  <input
                    id="before-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload("beforeScreenshotUrl", e.target.files)}
                  />
                </label>
              </div>
              {reimbursement.beforeScreenshotUrl && (
                <div className="text-sm text-muted-foreground">
                  Starting odometer photo uploaded
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="afterScreenshot">Ending Odometer</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="after-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> odometer photo
                    </p>
                  </div>
                  <input
                    id="after-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload("afterScreenshotUrl", e.target.files)}
                  />
                </label>
              </div>
              {reimbursement.afterScreenshotUrl && (
                <div className="text-sm text-muted-foreground">
                  Ending odometer photo uploaded
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 border-t p-6">
            <Button
              variant="outline"
              onClick={validateReimbursement}
              disabled={isValidating}
            >
              {isValidating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Validate
            </Button>
            <Button onClick={handleSubmit} disabled={isValidating}>
              Submit Reimbursement
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
