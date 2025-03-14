import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@nextui-org/react';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import {
  customerValidationSchema,
  ICustomerPayload,
} from '../../_utils/valididation';
import Input from '@potta/components/input';
// import Button from '@potta/components/button';

interface IAddCustomerDrawer {
  open: boolean;
  onClose: () => void;
}
const AddCustomerDrawer: FC<IAddCustomerDrawer> = ({ onClose, open }) => {
  const form = useForm<ICustomerPayload>({
    mode: 'onChange',
    resolver: yupResolver(customerValidationSchema),
  });
  return (
    <Drawer isOpen={open} onOpenChange={onClose}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader>
              <h3>Add Customers</h3>
            </DrawerHeader>
            <form action="">
              <DrawerBody>
                <Input
                  label="Customer first name"
                  register={form.register}
                  errors={form.formState.errors?.firstName}
                  name="firstName"
                  placeholder="Johny"
                />
                <Input
                  label="Customer last name"
                  register={form.register}
                  errors={form.formState.errors?.lastName}
                  name="lastName"
                  placeholder="dang"
                />
                <Input
                  label="Telephone"
                  register={form.register}
                  errors={form.formState.errors?.phone}
                  name="phone"
                  placeholder="67123456"
                  type="tel"
                />
                <Input
                  label="Email"
                  register={form.register}
                  errors={form.formState.errors?.email}
                  name="email"
                  placeholder="abc@example.com"
                  type="email"
                />
                <Input
                  label="Address"
                  register={form.register}
                  errors={form.formState.errors?.address?.address}
                  name="address.address"
                  placeholder="one street NS"
                  type="text"
                />

                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <Input
                    label="City"
                    register={form.register}
                    errors={form.formState.errors?.address?.city}
                    name="address.city"
                    placeholder="Douala"
                    type="text"
                  />
                  <Input
                    label="State"
                    register={form.register}
                    errors={form.formState.errors?.address?.state}
                    name="address.state"
                    placeholder="Littoral"
                    type="text"
                  />
                  <Input
                    label="Postal code"
                    register={form.register}
                    errors={form.formState.errors?.address?.postalCode}
                    name="address.postalCode"
                    placeholder="abc@example.com"
                    type="text"
                  />
                  <Input
                    label="country"
                    register={form.register}
                    errors={form.formState.errors?.address?.country}
                    name="address.country"
                    placeholder="cameroon"
                    type="text"
                  />
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button>Add Customer</Button>
              </DrawerFooter>
            </form>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default AddCustomerDrawer;
