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

interface ValidationError {
  product?: string;
  quantity?: string;
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
    case 'FCFA':
      return 'FCFA';
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
  const [errors, setErrors] = useState<ValidationError>({});

  // Get currency from context
  const currency = context?.data?.currency || 'USD';
  const currencySymbol = getCurrencySymbol(currency);

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
    // Clear product error when selection changes
    setErrors(prev => ({ ...prev, product: undefined }));

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

  const handleQtyChange = (value: string) => {
    // Clear quantity error when value changes
    setErrors(prev => ({ ...prev, quantity: undefined }));

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setQty(numValue);
    } else if (value === '') {
      setQty(0); // Allow empty field for better UX
    }
  };

  const validateItemInput = (): boolean => {
    const newErrors: ValidationError = {};

    if (!selectedProduct) {
      newErrors.product = 'Please select a product';
    }

    if (qty <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddRow = () => {
    if (!validateItemInput()) return;

    // Check if the product already exists in the table
    const existingProductIndex = rows.findIndex((row: any) => row.uuid === selectedProduct!.product.uuid);

    let updatedRows;

    if (existingProductIndex !== -1) {
      // If product exists, update its quantity
      updatedRows = [...rows];
      updatedRows[existingProductIndex] = {
        ...updatedRows[existingProductIndex],
        qty: updatedRows[existingProductIndex].qty + qty
      };
    } else {
      // If product doesn't exist, add a new row
      const newRow = {
        id: rows.length + 1,
        productId: selectedProduct!.product.productId,
        name: selectedProduct!.product.name,
        qty,
        price,
        tax,
        uuid: selectedProduct!.product.uuid,
      };
      updatedRows = [...rows, newRow];
    }

    // Update local state
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

  // Helper function to render required field marker
  const RequiredMark = () => <span className="text-red-500 ml-1">*</span>;

  return (
    <div>
        <table className="min-w-full border-collapse text-gray-500">
        <thead>
          <tr className="bg-gray-100">
            <th colSpan={3} className=" px-10 py-2">Product</th>
            <th colSpan={1} className="text-center px-4 py-2">Qty</th>
            <th colSpan={1} className="text-center px-4 py-2">Price</th>
            <th colSpan={1} className="text-center px-4 py-2">Tax</th>
            <th colSpan={1} className="text-center px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any) => (
            <tr key={row.id}>
              <td colSpan={3} className="px-10 py-2">
                 {row.name}
              </td>
              <td className="px-4 py-2 text-center">{row.qty}</td>
              <td className="px-4 py-2 text-center">{currencySymbol} {row.price}</td>
              <td className="px-4 py-2 text-center">{row.tax}%</td>
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
      <div className="py-4 grid grid-cols-8 gap-4">
        <div className="mb-2 col-span-3">
          <span className="mb-1 text-gray-900 font-medium block">
            Product <RequiredMark />
          </span>
              <SearchSelect
                options={productOptions}
                value={selectedProduct ? { label: selectedProduct.label, value: selectedProduct.value } : null}
                onChange={handleProductSelect}
                isLoading={productsLoading}
                placeholder="Search"
                isClearable={true}
                isSearchable={true}
            className={`mt-1 ${errors.product ? 'border-red-500' : ''}`}
              />
          {errors.product && (
            <p className="text-red-500 text-sm mt-1">{errors.product}</p>
          )}
    </div>
        <div>
          <span className="mb-1 text-gray-900 font-medium block">
            Qty <RequiredMark />
          </span>
          <input
            type="number"
            value={qty}
            onChange={(e) => handleQtyChange(e.target.value)}
            className={`border ${
              errors.quantity ? 'border-red-500' : 'border-gray-300'
            } px-2 pl-3 py-2.5 w-full outline-none mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center`}
            min="1"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
          )}
        </div>
        <div className="relative">
          <span className="mb-1 text-gray-900 font-medium block">
            Price
          </span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="border border-gray-300 px-2 pl-3 py-2.5 w-full outline-none mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
            disabled
          />
        </div>
        <div className="relative">
          <span className="mb-1 text-gray-900 font-medium block">
            Tax
          </span>
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(parseFloat(e.target.value))}
            className="border border-gray-300 px-2 pl-3 py-2.5 w-full outline-none mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled
          />
        </div>
      </div>

      <button
        onClick={handleAddRow}
        className={`${
          !selectedProduct ? 'bg-gray-400' : 'bg-green-600'
        } text-white px-4 py-2 rounded-full text-sm mt-4`}
      >
        <i className="ri-add-line mr-2"></i>Add Item
      </button>
    </div>
  );
}
