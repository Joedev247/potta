import React from 'react';

import Boxes from './components/boxes';
import TableComponents from './components/table';
import RootLayout from '../layout';
import { Toaster } from 'react-hot-toast';

const Vendors = () => {
  return (
    <RootLayout>
      <Toaster position="top-left" />
      <div className="px-14 py-5">
        <div>
          <Boxes />
        </div>
        <div>
          <TableComponents />
        </div>
      </div>
    </RootLayout>
  );
};
export default Vendors;
