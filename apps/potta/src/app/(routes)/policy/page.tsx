"use client"
import ApprovalRuleForm  from "./all";

 // pages/policies/create.tsx

export default function CreatePolicyPage() {
  const handleSubmit = (policyData:any) => {
    console.log('Policy data:', policyData);
    // Submit to your API
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Policy</h1>
  <ApprovalRuleForm 
    onSubmit={(data) => console.log('Form submitted:', data)} 
    onCancel={() => console.log('Form cancelled')} 
  />
    </div>
  );
}
