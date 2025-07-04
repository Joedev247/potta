'use client';
import React, { FC, useState, useEffect } from 'react';
import Table from '@potta/components/table';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@nextui-org/react';
import { Filter, Product } from '../_utils/types';
import useGetAllProducts from '../_hooks/useGetAllProducts';
import DeleteModal from './deleteModal';
import CustomPopover from '@potta/components/popover';
import EditProduct from './slides/components/update_product';
import { UpdateProductPayload } from '../_utils/validation';
import TableActionPopover, {
  PopoverAction,
} from '@potta/components/tableActionsPopover';
import ViewProductSlider from './slides/components/viewProduct';
import { useInventory } from '../_utils/context';
import { documentsApi } from '../_utils/api';
import Image from 'next/image';
import ProductEditStepperModal from './ProductEditStepperModal';

const InventoryTable = () => {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<string | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = useState<string | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productDetails, setproductDetails] = useState<Product | null>(null);
  const { setSelectedProduct } = useInventory();
  const [imageUrls, setImageUrls] = useState<{ [productId: string]: string }>(
    {}
  );

  // Handle row click to view product details
  const handleRowClick = (row: Product) => {
    setSelectedProduct(row);
  };

  const columns = [
    {
      name: 'Name',
      selector: (row: Product) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 grid content-center ">
            {/* <Image
              src={
                imageUrls[row.uuid] ||
                (Array.isArray(row.documents) &&
                row.documents.length > 0 &&
                row.documents[0]?.url
                  ? row.documents[0].url
                  : '/images/placeholder.png')
              }
              alt=""
              width={60}
              height={60}
              className="w-full h-full object-cover"
            /> */}
          </div>
          <p className="mt-0.5">{row.name}</p>
        </div>
      ),
    },
    {
      name: 'Sku',
      selector: (row: Product) => row.sku,
    },
    {
      name: 'Type',
      selector: (row: Product) =>
        row.category && typeof row.category === 'object'
          ? row.category.name
          : row.category || '',
    },
    {
      name: 'Tax',
      selector: (row: Product) =>
        row.tax && typeof row.tax === 'object' ? row.tax.name : row.tax || '',
    },
    {
      name: 'Cost',
      selector: (row: Product) => <div> {row.cost}</div>,
    },
    {
      name: 'Sale Price',
      selector: (row: Product) => <div> {row.salesPrice}</div>,
    },
    {
      name: 'Inventory',
      selector: (row: Product) => <div>{row.inventoryLevel}</div>,
    },
    {
      name: 'Reorder Point',
      selector: (row: Product) => <div className="">355</div>,
    },
    {
      name: '',
      selector: (row: any) => {
        const actions: PopoverAction[] = [
          {
            label: 'View',
            onClick: () => {
              setOpenViewModal(row.uuid);
              setIsViewOpen(true);
            },
            className: 'hover:bg-gray-200',
            icon: <i className="ri-eye-line" />,
          },
          {
            label: 'Edit',
            onClick: () => {
              setOpenUpdateModal(row.uuid);
              setproductDetails({
                ...row,
                cost: Number(row.cost),
                salesPrice: Number(row.salesPrice),
                images: Array.isArray(row.documents)
                  ? row.documents
                      .filter(
                        (doc: any) =>
                          doc.mimeType && doc.mimeType.startsWith('image')
                      )
                      .map((doc: any) => doc.url)
                  : [],
              });
              setIsEditOpen(true);
            },
            className: 'hover:bg-gray-200',
            icon: <i className="ri-edit-line" />,
          },
          {
            label: 'Delete',
            onClick: () => {
              setOpenDeleteModal(row.uuid);
              setIsDeleteOpen(true);
            },
            className: 'hover:bg-red-200 text-red-600',
            icon: <i className="ri-delete-bin-line" />,
          },
        ];

        return (
          <TableActionPopover
            actions={actions}
            rowUuid={row.uuid}
            openPopover={openPopover}
            setOpenPopover={setOpenPopover}
          />
        );
      },
    },
  ];

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filter: Filter = { page, limit };
  const { data, isLoading, error, refetch } = useGetAllProducts(filter);

  // Fetch signed URLs for product images
  useEffect(() => {
    const fetchSignedUrls = async () => {
      if (!data?.data) return;
      // Collect all document IDs for products with images
      const docIdMap: { [productId: string]: string } = {};
      data.data.forEach((product: Product) => {
        if (
          Array.isArray(product.documents) &&
          product.documents.length > 0 &&
          product.documents[0]?.uuid
        ) {
          docIdMap[product.uuid] = product.documents[0].uuid;
        }
      });
      const docIds = Object.values(docIdMap);
      if (docIds.length === 0) return;
      try {
        const res = await documentsApi.bulkDownload(docIds);
        // Map productId to signed URL
        const urlMap: { [productId: string]: string } = {};
        let i = 0;
        for (const [productId, docId] of Object.entries(docIdMap)) {
          urlMap[productId] = res.urls[i] || '';
          i++;
        }
        setImageUrls(urlMap);
      } catch (e) {
        // ignore
      }
    };
    fetchSignedUrls();
  }, [data?.data]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePerRowsChange = (newLimit: number, newPage: number) => {
    setLimit(newLimit);
    setPage(newPage); // Reset page when changing rows per page
  };
  return (
    <div className="mt-10">
      <div></div>
      <Table
        minHeight="70vh"
        maxHeight="70vh"
        columns={columns}
        data={data?.data || []}
        ExpandableComponent={null}
        expanded
        pagination
        pending={isLoading}
        paginationServer
        paginationTotalRows={data?.meta?.totalItems ?? 0}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        onRowClicked={handleRowClick}
        pointerOnHover={true}
      />
      {openDeleteModal && (
        <DeleteModal
          productID={openDeleteModal}
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
        />
      )}
      <ProductEditStepperModal
        open={isEditOpen}
        setOpen={setIsEditOpen}
        product={productDetails}
        productId={productDetails?.uuid || ''}
        onComplete={refetch}
      />
      {openViewModal && (
        <ViewProductSlider
          productId={openViewModal}
          open={isViewOpen}
          setOpen={setIsViewOpen}
        />
      )}
    </div>
  );
};

export default InventoryTable;
