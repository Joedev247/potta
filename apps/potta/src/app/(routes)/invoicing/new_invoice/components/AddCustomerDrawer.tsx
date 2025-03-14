import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@nextui-org/react';
import React, { FC } from 'react';

interface IAddCustomerDrawer {
  open: boolean;
  onClose: () => void;
}
const AddCustomerDrawer: FC<IAddCustomerDrawer> = ({ onClose, open }) => {
  return (
    <Drawer isOpen={open} onOpenChange={onClose}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader>
              <h3>Add Customers</h3>
            </DrawerHeader>
            <form action="">
              <DrawerBody></DrawerBody>
              <DrawerFooter></DrawerFooter>
            </form>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default AddCustomerDrawer;
