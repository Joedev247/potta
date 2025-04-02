import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MoreVertical } from 'lucide-react';
import Button from '@potta/components/button';
import Search from '@potta/components/search';

interface Account {
  id: string;
  name: string;
  type: string;
  description: string;
  balance: string;
  total: string;
  parentId: string | null;
  isParent?: boolean;
}

const TableAccount = () => {
  const accounts: Account[] = [
    { id: 'cash', name: 'Cash', type: 'Assets', description: '', balance: 'FCFA0', total: 'FCFA0', parentId: null, isParent: true },
    { id: '10001', name: '[10001] - Cash', type: 'Assets', description: 'Money that is immediately available for transactions.', balance: 'FCFA0', total: 'FCFA0', parentId: 'cash' },
    { id: '10002', name: '[10002] - Petty cash', type: 'Assets', description: 'Small amount of cash on hand set aside to cover small purchases.', balance: 'FCFA0', total: 'FCFA0', parentId: 'cash' },
    
    { id: 'current-assets', name: 'Current assets', type: 'Assets', description: '', balance: 'FCFA0', total: 'FCFA0', parentId: null, isParent: true },
    { id: '10006', name: '[10006] - Investment', type: 'Assets', description: 'Money given to another person or a company with the expectation of profit.', balance: 'FCFA0', total: 'FCFA0', parentId: 'current-assets' },
    
    { id: 'accounts-receivable', name: 'Accounts receivable', type: 'Assets', description: '', balance: 'FCFA0', total: 'FCFA0', parentId: null, isParent: true },
    { id: '10004', name: '[10004] - Account receivable', type: 'Assets', description: 'Money owed to the business by its customers for goods and services delivered', balance: 'FCFA0', total: 'FCFA0', parentId: 'accounts-receivable' },
    { id: '10007', name: '[10007] - WHT receivable control', type: 'Assets', description: 'Manages Withholding Tax Transactions', balance: 'FCFA0', total: 'FCFA0', parentId: 'accounts-receivable' },
    
    { id: 'inventory', name: 'Inventory', type: 'Assets', description: '', balance: 'FCFA0', total: 'FCFA0', parentId: null, isParent: true },
    { id: '10005', name: '[10005] - Inventory', type: 'Assets', description: 'Goods and materials held for sale or parts used to make goods and services', balance: 'FCFA0', total: 'FCFA0', parentId: 'inventory' },
    
    { id: 'fixed-assets', name: 'Fixed assets', type: 'Assets', description: '', balance: 'FCFA0', total: 'FCFA0', parentId: null, isParent: true },
    { id: '10009', name: '[10009] - Land and buildings', type: 'Assets', description: 'Cost associated with the ownership of land, buildings, and improvements such as fences and paved surfaces.', balance: 'FCFA0', total: 'FCFA0', parentId: 'fixed-assets' },
    { id: '10010', name: '[10010] - Office equipments', type: 'Assets', description: 'Machinery, tools, and supplies used to perform the operations of a business.', balance: 'FCFA0', total: 'FCFA0', parentId: 'fixed-assets' },
    { id: '10011', name: '[10011] - Furnitures and fittings', type: 'Assets', description: 'Equipment and furniture used to furnish an office or workspace.', balance: 'FCFA0', total: 'FCFA0', parentId: 'fixed-assets' },
    
    { id: 'intangible-assets', name: 'Intangible assets', type: 'Assets', description: '', balance: 'FCFA0', total: 'FCFA0', parentId: null, isParent: true }
  ];

  // State for tracking expanded rows
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    'cash': true,
    'current-assets': true,
    'accounts-receivable': true,
    'inventory': true,
    'fixed-assets': true,
    'intangible-assets': true
  });

  // Toggle row expansion
  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  // Filter accounts based on parent-child relationship
  const getChildAccounts = (parentId: string | null) => {
    return accounts.filter(account => account.parentId === parentId);
  };

  // Get parent accounts (top level)
  const parentAccounts = accounts.filter(account => account.isParent);

  return (
    <div className="flex flex-col bg-white">
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div className="relative w-1/3">
            <Search />
          </div>
        </div>
        
        <div className="w-full overflow-hidden">
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: '25%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '40%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '5%' }} />
            </colgroup>
            <thead className="bg-[#F3FBFB] h-16 border border-[#DDE6E2]">
              <tr className="text-lg border-gray-200">
                <th className="text-left font-semibold py-2 px-4">Account Name</th>
                <th className="text-left py-2 px-4">Type</th>
                <th className="text-left py-2 px-4">Description</th>
                <th className="text-left py-2 px-4">Balance</th>
                <th className="text-left py-2 px-4">Total</th>
                <th className="text-left py-2 px-4">Actions</th>
              </tr>
            </thead>
          </table>
          
          <div className="max-h-[600px] min-h-[600px] css-dip3t8 overflow-y-auto">
            <table className="w-full table-fixed">
              <colgroup>
                <col style={{ width: '25%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '40%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '5%' }} />
              </colgroup>
              <tbody className="text-gray-700">
                {parentAccounts.map(parent => (
                  <React.Fragment key={parent.id}>
                    {/* Parent row */}
                    <tr className="bg-gray-100 cursor-pointer h-16 hover:bg-gray-200" onClick={() => toggleRowExpansion(parent.id)}>
                      <td className="py-2 px-4 h-16 flex items-center truncate">
                        {expandedRows[parent.id] ? (
                          <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                        )}
                        <span className="truncate">{parent.name}</span>
                      </td>
                      <td className="py-2 px-4 truncate">{parent.type}</td>
                      <td className="py-2 px-4 truncate">{parent.description}</td>
                      <td className="py-2 px-4 truncate">{parent.balance}</td>
                      <td className="py-2 px-4 truncate">{parent.total}</td>
                      <td className="py-2 px-4"></td>
                    </tr>
                    
                    {/* Child rows */}
                    {expandedRows[parent.id] && getChildAccounts(parent.id).map(child => (
                      <tr key={child.id} className="bg-white border-t border-gray-100 hover:bg-gray-50 h-16">
                        <td className="py-2 px-4 pl-10 truncate">{child.name}</td>
                        <td className="py-2 px-4 truncate">{child.type}</td>
                        <td className="py-2 px-4 truncate">{child.description}</td>
                        <td className="py-2 px-4 truncate">{child.balance}</td>
                        <td className="py-2 px-4 truncate">{child.total}</td>
                        <td className="py-2 px-4 flex justify-center">
                          <button className="hover:bg-gray-100 p-1 rounded-full">
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableAccount;