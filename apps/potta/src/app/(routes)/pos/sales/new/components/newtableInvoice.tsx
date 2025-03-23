import { useContext, useState } from 'react';
import { ContextData } from '@potta/components/context';
import SearchSelect, { Option } from '@potta/components/search-select'; // Import Option type
import useGetAllProducts from '../../../inventory/_hooks/useGetAllProducts';


interface Product {
  uuid: string;
  name: string;
  price: number;
  tax: number;
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
  const [price, setPrice] = useState(0);
  const [tax, setTax] = useState(0);

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useGetAllProducts({
    page: 1,
    limit: 100,
  });

  // Replace this line:
  const products: Product[] = (productsData?.data || []).map(product => ({
    uuid: product.uuid,
    name: product.name,
    price: product.salesPrice,
    tax: product.taxRate,
    productId: product.productId
  }));

  // Create product options as regular Options instead of ProductOptions
  const productOptions: Option[] = products.map((product) => ({
    label: `${product.name} `,
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
        setPrice(selectedProd.price);
        setTax(selectedProd.tax);
      }
    } else {
    setSelectedProduct(null);
      setPrice(0);
      setTax(0);
    }
  };

  const handleAddRow = () => {
    if (!selectedProduct) return;

    const newRow = {
      id: rows.length + 1,
      productId: selectedProduct.product.productId,
      name: selectedProduct.product.name,
      qty,
      price,
      tax,
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
    setPrice(0);
    setTax(0);
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
            <th className="text-left px-10 py-2">Product</th>
            <th className="text-left px-4 py-2">Qty</th>
            <th className="text-left px-4 py-2">Price</th>
            <th className="text-left px-4 py-2">Tax</th>
            <th className="text-left px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any) => (
            <tr key={row.id}>
              <td className="px-10 py-2">
                 {row.name}
              </td>
              <td className="px-4 py-2">{row.qty}</td>
              <td className="px-4 py-2">{row.price}</td>
              <td className="px-4 py-2">{row.tax}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleRemoveRow(row.id)}
                  className="text-red-500"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </td>
            </tr>
          ))}
          <tr className="py-4">
            <td className="mb-2">
              <SearchSelect
                options={productOptions}
                value={selectedProduct ? { label: selectedProduct.label, value: selectedProduct.value } : null}
                onChange={handleProductSelect}
                isLoading={productsLoading}
                placeholder="Search"
                isClearable={true}
                isSearchable={true}
                className="mt-2"
              />
            </td>
            <td className="">
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value))}
                className="border border-gray-300 px-2 pl-3 py-2.5 w-full outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </td>
            <td className="">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="border border-gray-300 px-2 pl-3 py-2.5 w-full outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
            </td>
            <td className="">
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(parseFloat(e.target.value))}
                className="border border-gray-300 px-2 pl-3 py-2.5 w-full outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
            </td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={handleAddRow}
        disabled={!selectedProduct}
        className={`${
          !selectedProduct ? 'bg-gray-400' : 'bg-green-600'
        } text-white px-4 py-2 rounded-full text-sm mt-4`}
      >
        <i className="ri-add-line mr-2"></i>Add Item
      </button>
    </div>
  );
}
