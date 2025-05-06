import { useContext, useState } from 'react';
import { ContextData } from '@potta/components/context';
import SearchSelect, { Option } from '@potta/components/search-select';
import useGetAllProducts from '@potta/app/(routes)/pos/inventory/_hooks/useGetAllProducts';
import Input from '@potta/components/input';

interface Product {
  uuid: string;
  name: string;
  productId: string;
}

interface ProductOption {
  label: string;
  value: string;
  product: Product;
}

export default function DynamicTable() {
  const context = useContext(ContextData);
  const [rows, setRows] = useState<any>(context?.data?.table || []);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [qty, setQty] = useState(1);

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useGetAllProducts({
    page: 1,
    limit: 100,
  });

  // Map products data - simplified to only include necessary fields
  const products: Product[] = (productsData?.data || []).map(product => ({
    uuid: product.uuid,
    name: product.name,
    productId: product.productId,
  }));

  // Create product options as regular Options
  const productOptions: Option[] = products.map((product) => ({
    label: `${product.name}`,
    value: product.uuid
  }));

  // Update handler to accept Option instead of ProductOption
  const handleProductSelect = (value: Option | null) => {
    if (value) {
      const selectedProd = products.find(p => p.uuid === value.value);
      if (selectedProd) {
        const productOption: ProductOption = {
          label: value.label,
          value: value.value as string,
          product: selectedProd
        };
        setSelectedProduct(productOption);
      }
    } else {
      setSelectedProduct(null);
    }
  };

  const handleAddRow = () => {
    if (!selectedProduct) return;

    const newRow = {
      id: rows.length + 1,
      productId: selectedProduct.product.productId,
      name: selectedProduct.product.name,
      qty,
      uuid: selectedProduct.product.uuid,
    };

    // Append new row to local state and context
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);

    // Update context data
    context?.setData((prevData: any) => ({
      ...prevData,
      table: updatedRows,
    }));

    // Reset input fields
    setSelectedProduct(null);
    setQty(1);
  };

  const handleRemoveRow = (id: number) => {
    const updatedRows = rows.filter((row: any) => row.id !== id);

    // Update context data
    context?.setData((prevData: any) => ({
      ...prevData,
      table: updatedRows,
    }));

    // Update local state
    setRows(updatedRows);
  };

  return (
    <div>
      <table className="min-w-full border-collapse text-gray-500">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left px-6 py-2">Product</th>
            <th className="text-center px-4 py-2">Qty</th>
            <th className="text-center px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any) => (
            <tr key={row.id} className="border-b">
              <td className="px-6 py-2 text-left">
                {row.name}
              </td>
              <td className="px-4 py-2 text-center">{row.qty}</td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => handleRemoveRow(row.id)}
                  className="text-red-500"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <SearchSelect
            options={productOptions}
            value={selectedProduct ? { label: selectedProduct.label, value: selectedProduct.value } : null}
            onChange={handleProductSelect}
            isLoading={productsLoading}
            placeholder="Search for product"
            isClearable={true}
            isSearchable={true}
            className="w-full"
          />
        </div>

        <div>
          <Input
            name={'qty'}
            type="number"
            value={qty}
            onchange={(e) => setQty(parseInt(e.target.value) || 1)}
            min={1}
            placeholder="Qty"
          />
        </div>
      </div>

      <button
        onClick={handleAddRow}
        disabled={!selectedProduct}
        className={`mt-4 ${!selectedProduct ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          } text-white px-4 py-2 rounded-md`}
      >
        <i className="ri-add-line mr-2"></i>Add Item
      </button>
    </div>
  );
}