'use client';
import React from 'react';
import RootLayout from '../../layout';
import App from './components/tabelComponent';
import Filter from './components/filters';
import InventoryTable from './components/table';
import { InventoryProvider } from './_utils/context';

const Files = () => {
  return (
    <InventoryProvider>
      <RootLayout>
        <div className="pl-16 pr-5 w-full mt-10">
          <Filter />
          <InventoryTable />
        </div>
      </RootLayout>
    </InventoryProvider>
  );
};
export default Files;
