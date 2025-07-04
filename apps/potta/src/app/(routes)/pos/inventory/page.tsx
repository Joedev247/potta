'use client';
import React, { useState } from 'react';
import RootLayout from '../../layout';
import Filter from './components/filters';
import InventoryTable from './components/table';
import { InventoryProvider } from './_utils/context';
import CategoryManager from './components/CategoryManager';

const Files = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'category'>(
    'inventory'
  );
  return (
    <InventoryProvider>
      <RootLayout>
        <div className="pl-16 pr-5 w-full mt-10">
          {/* Tabs */}
          <div className="w-[30%] flex mb-6">
            <div
              onClick={() => setActiveTab('inventory')}
              className={`w-full h-12 flex justify-center cursor-pointer items-center bg-[#F3FBFB] ${
                activeTab === 'inventory' &&
                'border-b-2 border-[#154406] text-[#154406] font-medium'
              }`}
            >
              <p>Inventory</p>
            </div>
            <div
              onClick={() => setActiveTab('category')}
              className={`w-full h-12 flex justify-center cursor-pointer items-center bg-[#F3FBFB] ${
                activeTab === 'category' &&
                'border-b-2 border-[#154406] text-[#154406] font-medium'
              }`}
            >
              <p>Category</p>
            </div>
          </div>
          {activeTab === 'inventory' ? (
            <>
              <Filter />
              <InventoryTable />
            </>
          ) : (
            <CategoryManager />
          )}
        </div>
      </RootLayout>
    </InventoryProvider>
  );
};
export default Files;
