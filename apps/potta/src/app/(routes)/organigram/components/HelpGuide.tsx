'use client';

interface HelpGuideProps {
  isVisible: boolean;
}

export default function HelpGuide({ isVisible }: HelpGuideProps) {
  if (!isVisible) return null;

  return (
    <div className="mt-4 p-4 bg-[#F3FCE9] border border-[#A0E86F]">
      <h3 className="font-semibold text-[#237804] mb-3">
        How to Use the Organigram:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium text-[#237804] mb-2">Create Options:</h4>
          <ul className="space-y-1 text-gray-700">
            <li>
              • <strong>Department:</strong> Create organizational departments
            </li>
            <li>
              • <strong>Location:</strong> Add office locations and addresses
            </li>
            <li>
              • <strong>Geographical Unit:</strong> Define regions and
              territories
            </li>
            <li>
              • <strong>Sub-Business:</strong> Create business units and
              divisions
            </li>
            <li>
              • <strong>Role:</strong> Define job roles and positions
            </li>
            <li>
              • <strong>Template:</strong> Create organizational templates
            </li>
            <li>
              • <strong>Business-Geo Assignment:</strong> Link businesses to
              regions
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-[#237804] mb-2">Navigation:</h4>
          <ul className="space-y-1 text-gray-700">
            <li>
              • <strong>Hierarchy View:</strong> Interactive tree chart with
              nodes
            </li>
            <li>
              • <strong>Location View:</strong> Table organized by office
              locations
            </li>
            <li>
              • <strong>Business Unit View:</strong> Table organized by business
              units
            </li>
            <li>
              • <strong>Search:</strong> Find departments or employees by name
            </li>
            <li>
              • <strong>Filters:</strong> Filter by location, business unit, or
              region
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-3 p-3 bg-white border border-[#A0E86F]">
        <h4 className="font-medium text-[#237804] mb-2">Color Coding:</h4>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#237804]"></div>
            <span>CEO/Executive</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#3C9D39]"></div>
            <span>VP/Director</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#53B550]"></div>
            <span>Manager</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#78C576]"></div>
            <span>Team Lead</span>
          </div>
        </div>
      </div>
    </div>
  );
}
