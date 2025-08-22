'use client';

interface CreateTemplateFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isCreating: boolean;
}

export default function CreateTemplateForm({
  onSubmit,
  onCancel,
  isCreating,
}: CreateTemplateFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      template_name: formData.get('template_name') as string,
      description: formData.get('description') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template Name *
          </label>
          <input
            type="text"
            name="template_name"
            required
            minLength={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter template name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            required
            minLength={10}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#237804]"
            placeholder="Enter template description"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={isCreating}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#237804] text-white hover:bg-[#1D6303] disabled:opacity-50"
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Template'}
        </button>
      </div>
    </form>
  );
}
