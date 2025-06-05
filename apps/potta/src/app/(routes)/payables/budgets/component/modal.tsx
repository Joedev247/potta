'use client';
import Button from '@potta/components/button';
import { ContextData } from '@potta/components/context';
import Input from '@potta/components/input';
import Modal from '@potta/components/modal';
import Select from '@potta/components/select';
import React, { FC, useState, useContext } from 'react';

const NewBudget: FC = () => {
  const context = useContext(ContextData);
  const [open, setOpen] = useState<boolean>(false);

  const [newBudget, setNewBudget] = useState<{
    budget_name: string;
    budget_goal: string;
    currency: string;
    budget_recurrence: string;
  }>({
    budget_name: '',
    budget_goal: '',
    currency: 'XAF',
    budget_recurrence: 'One time',
  });

  if (!context) {
    return null;
  }

  const HandleNewBudgetChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewBudget((prevNewBudget) => ({
      ...prevNewBudget,
      [name]: value,
    }));
  };

  const CreateNewBudget = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId =
      context.payouts.length > 0
        ? context.payouts[context.payouts.length - 1].id + 1
        : 1;
    const newBudgetData = {
      id: newId,
      budget_name: newBudget.budget_name,
      budget_goal: Number(newBudget.budget_goal),
      currency: newBudget.currency,
      amount_spent: 0,
      amount_allocated: Number(newBudget.budget_goal),
      amount_available: Number(newBudget.budget_goal),
    };

    context.setPayouts((current: any) => [...current, newBudgetData]);
    setOpen(false);
    setNewBudget({
      budget_name: '',
      budget_goal: '',
      currency: 'XAF',
      budget_recurrence: 'One time',
    });
  };

  return (
    <Modal
      icon={<i className="ri-add-line"></i>}
      title="New Budget"
      text="Add New Budget"
      open={open}
      setOpen={setOpen}
    >
      <div className="bg-white transform overflow-hidden rounded-md py-4">
        <div className="flex flex-col px-4 border-b"></div>

        <form onSubmit={CreateNewBudget}>
          <div className="flex flex-col mt-6 px-8">
            <div className="w-full mb-3">
              <p className="mb-2 text-gray-900 font-medium">Budget Name</p>
              <Input
                type="text"
                name="budget_name"
                onchange={HandleNewBudgetChange}
                value={newBudget.budget_name}
                required
              />
            </div>

            <div className="w-full mb-3">
              <span className="mb-3 text-gray-900 font-medium">
                Budget Goal
              </span>
              <div className="flex w-full rounded-md divide-x">
                <div className="w-[90%]">
                  <Input
                    type="number"
                    name="budget_goal"
                    onchange={HandleNewBudgetChange}
                    value={newBudget.budget_goal}
                    required
                    min="0"
                  />
                </div>
                <div className="mt-2">
                  <Select
                    options={[{ value: 'XAF', label: 'XAF' }]}
                    selectedValue={newBudget.currency}
                    onChange={(e) => HandleNewBudgetChange(e as any)}
                    bg="border"
                  />
                </div>
              </div>
            </div>

            <div className="w-full mb-3">
              <p className="mb-3 text-gray-900 font-medium">
                Budget Recurrence
              </p>
              <Select
                options={[{ value: 'One time', label: 'One time' }]}
                selectedValue={newBudget.budget_recurrence}
                onChange={(e) => HandleNewBudgetChange(e as any)}
                bg="border"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8 border-t pt-4 px-8">
            <Button type="submit" text="Create Budget" />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NewBudget;
