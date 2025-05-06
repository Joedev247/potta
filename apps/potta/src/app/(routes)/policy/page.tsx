"use client" // pages/policies/create.tsx
import { PolicyForm } from './components/spend-policy/policy-form';

export default function CreatePolicyPage() {
  const handleSubmit = (policyData:any) => {
    console.log('Policy data:', policyData);
    // Submit to your API
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Policy</h1>
      <PolicyForm onSubmit={handleSubmit} />
    </div>
  );
}
