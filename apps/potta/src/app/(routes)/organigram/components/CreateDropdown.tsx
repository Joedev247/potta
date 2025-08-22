'use client';

interface CreateDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectType: (type: string) => void;
}

export default function CreateDropdown({
  isOpen,
  onToggle,
  onSelectType,
}: CreateDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="px-4 py-2 bg-[#237804] text-white hover:bg-[#1D6303] transition-colors flex items-center space-x-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Create</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Create Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-2">
              Organizational Structure
            </div>
            <button
              onClick={() => onSelectType('department')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <span>Department</span>
            </button>

            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-2 mt-3">
              Locations & Geography
            </div>
            <button
              onClick={() => onSelectType('location')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <span>Location</span>
            </button>
            <button
              onClick={() => onSelectType('geographical-unit')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <span>Geographical Unit</span>
            </button>

            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-2 mt-3">
              Business Units
            </div>
            <button
              onClick={() => onSelectType('sub-business')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <span>Sub-Business</span>
            </button>
            <button
              onClick={() => onSelectType('business-geo-assignment')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <span>Business-Geo Assignment</span>
            </button>

            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-2 mt-3">
              Roles & Templates
            </div>
            <button
              onClick={() => onSelectType('role')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <span>Role</span>
            </button>
            <button
              onClick={() => onSelectType('template')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <span>Template</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
