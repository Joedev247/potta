import React from 'react';
import DataGrid from '@potta/app/(routes)/account_receivables/components/DataGrid';
import Button from '@potta/components/button';
import useGetAllProductCategories from '../_hooks/useGetAllProductCategories';
import useCreateProductCategory from '../_hooks/useCreateProductCategory';
import { ProductCategory } from '../_utils/types';
import { productCategorySchema } from '../_utils/validation';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@potta/components/shadcn/dropdown';
import * as yup from 'yup';
import Input from '@potta/components/input';
import { useProductCategoryManager } from '../_hooks/useProductCategoryManager';

const CategoryManager = () => {
  const {
    modalOpen,
    setModalOpen,
    openPopover,
    setOpenPopover,
    editMode,
    setEditMode,
    editId,
    setEditId,
    deleteId,
    setDeleteId,
    data,
    isLoading,
    register,
    handleSubmit,
    setValue,
    reset,
    errors,
    handleOpenModal,
    handleEdit,
    handleDelete,
    onSubmit,
    createCategory,
  } = useProductCategoryManager();

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row: { original } }) => original.name,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row: { original } }) => original.description,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row: { original } }) =>
        new Date(original.createdAt).toLocaleDateString(),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row: { original } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <i className="ri-more-2-fill text-xl text-gray-600"></i>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleEdit(original)}>
              <i className="ri-edit-line mr-2"></i> Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setDeleteId(original.uuid)}
              className="text-red-600"
            >
              <i className="ri-delete-bin-line mr-2"></i> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="py-10 w-full">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Product Categories</h2>
        <Button text={'Add Category'} type="button" onClick={handleOpenModal} />
      </div>
      <DataGrid
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
      />
      {/* Modal for creating or editing a category */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 transition-opacity duration-300">
          <div className="bg-white p-8 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
            <h3 className="text-xl font-semibold mb-4">
              {editMode ? 'Edit Category' : 'Add Category'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  label="Name"
                  type="text"
                  name="name"
                  register={register}
                  errors={errors.name}
                  required
                />
              </div>
              <div>
                <Input
                  label="Description"
                  type="text"
                  name="description"
                  register={register}
                  errors={errors.description}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  text="Cancel"
                  type="button"
                  theme="gray"
                  onClick={() => {
                    setModalOpen(false);
                    setEditMode(false);
                    setEditId(null);
                    reset();
                  }}
                />
                <Button
                  text={
                    createCategory.isPending
                      ? editMode
                        ? 'Saving...'
                        : 'Saving...'
                      : editMode
                      ? 'Save Changes'
                      : 'Save'
                  }
                  type="submit"
                  isLoading={createCategory.isPending}
                />
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 transition-opacity duration-300">
          <div className="bg-white shadow-lg p-8 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
            <h3 className="text-xl font-semibold mb-4">Delete Category</h3>
            <p>Are you sure you want to delete this category?</p>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                text="Cancel"
                type="button"
                theme="gray"
                onClick={() => setDeleteId(null)}
              />
              <Button
                text="Delete"
                type="button"
                theme="red"
                onClick={handleDelete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
