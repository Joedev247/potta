import { useContext, useState } from 'react';
import { ContextData } from '@potta/components/context';
import SearchSelect, { Option } from '@potta/components/search-select';
import useGetAllProducts from '@potta/app/(routes)/pos/inventory/_hooks/useGetAllProducts';

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

// Function to get currency symbol based on currency code
const getCurrencySymbol = (currencyCode: string): string => {
  switch (currencyCode) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'XAF':
      return 'XAF';
    default:
      return currencyCode;
  }
};

export default function DynamicTable() {
  const context = useContext(ContextData);
  const [rows, setRows] = useState<any>(context?.data?.table || []);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [discountCap, setDiscountCap] = useState(0);

  // Get currency from context
  const currency = context?.data?.currency || 'USD';
  const currencySymbol = getCurrencySymbol(currency);

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useGetAllProducts({
    page: 1,
    limit: 100,
  });

  // Map products data
  const products: Product[] = (productsData?.data || []).map(product => ({
    uuid: product.uuid,
    name: product.name,
    price: product.salesPrice,
    tax: product.taxRate,
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
      discountRate,
      discountCap,
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
    setDiscountRate(0);
    setDiscountCap(0);
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

  // Calculate row total
  const calculateRowTotal = (row: any) => {
    const baseAmount = row.price * row.qty;
    const discountAmount = Math.min((baseAmount * row.discountRate) / 100, row.discountCap || Infinity);
    const taxableAmount = baseAmount - discountAmount;
    const taxAmount = (taxableAmount * row.tax) / 100;
    return taxableAmount + taxAmount;
  };

  return (
    <div>
      <table className="min-w-full border-collapse text-gray-500">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left px-6 py-2">Product</th>
            <th className="text-center px-4 py-2">Qty</th>
            <th className="text-center px-4 py-2">Price</th>
            <th className="text-center px-4 py-2">Discount %</th>
            <th className="text-center px-4 py-2">Discount Cap</th>
            <th className="text-center px-4 py-2">Tax %</th>
            <th className="text-center px-4 py-2">Total</th>
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
              <td className="px-4 py-2 text-center">{currencySymbol} {row.price}</td>
              <td className="px-4 py-2 text-center">{row.discountRate}%</td>
              <td className="px-4 py-2 text-center">{currencySymbol} {row.discountCap}</td>
              <td className="px-4 py-2 text-center">{row.tax}%</td>
              <td className="px-4 py-2 text-center font-medium">
                {currencySymbol} {calculateRowTotal(row).toFixed(2)}
              </td>
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
      
      <div className="mt-4 grid grid-cols-6 gap-4">
        <div className="col-span-2">
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
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value) || 1)}
            min="1"
            className="border border-gray-300 px-2 py-2 w-full rounded"
            placeholder="Qty"
          />
        </div>
        
        <div>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            className="border border-gray-300 px-2 py-2 w-full rounded"
            placeholder="Price"
          />
        </div>
        
        <div>
          <input
            type="number"
            value={discountRate}
            onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
            min="0"
            max="100"
            className="border border-gray-300 px-2 py-2 w-full rounded"
            placeholder="Discount %"
          />
        </div>
        
        <div>
          <input
            type="number"
            value={discountCap}
            onChange={(e) => setDiscountCap(parseFloat(e.target.value) || 0)}
            min="0"
            className="border border-gray-300 px-2 py-2 w-full rounded"
            placeholder="Discount Cap"
          />
        </div>
      </div>

      <button
        onClick={handleAddRow}
        disabled={!selectedProduct}
        className={`mt-4 ${
          !selectedProduct ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
        } text-white px-4 py-2 rounded-md`}
      >
        <i className="ri-add-line mr-2"></i>Add Item
      </button>
      
      {rows.length > 0 && (
        <div className="flex justify-end mt-6">
          <div className="w-60 border rounded-md p-4 bg-gray-50">
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>
                {currencySymbol} {rows.reduce((sum: any, row: any) => sum + (row.price * row.qty), 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Discounts:</span>
              <span className="text-red-500">
                - {currencySymbol} {rows.reduce((sum: any, row: any) => {
                  const baseAmount = row.price * row.qty;
                  return sum + Math.min((baseAmount * row.discountRate) / 100, row.discountCap || Infinity);
                }, 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Tax:</span>
              <span>
                {currencySymbol} {rows.reduce((sum: any, row: any) => {
                  const baseAmount = row.price * row.qty;
                  const discountAmount = Math.min((baseAmount * row.discountRate) / 100, row.discountCap || Infinity);
                  const taxableAmount = baseAmount - discountAmount;
                  return sum + (taxableAmount * row.tax) / 100;
                }, 0).toFixed(2)}
              </span>
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span>
                {currencySymbol} {rows.reduce((sum: any, row: any) => sum + calculateRowTotal(row), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}