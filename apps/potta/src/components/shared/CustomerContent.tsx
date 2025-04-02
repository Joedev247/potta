'use client';
import React from 'react';
import Boxes from '../../app/(routes)/customers/components/boxes';
import TableComponents from '../../app/(routes)/customers/components/table';
import { toast } from 'react-hot-toast';

const CustomerContent = () => {
  return (
    <div className="px-14 py-5">
      <div>
        <Boxes />
      </div>
      <div>
        <TableComponents />
      
      </div>
    </div>
  );
};

export default CustomerContent;
