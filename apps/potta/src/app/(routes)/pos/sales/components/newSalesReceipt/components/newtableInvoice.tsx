import { useContext, useState } from 'react';
import { ContextData } from '@potta/components/context';

export default function DynamicTable() {
  const context = useContext(ContextData);
  const [rows, setRows] = useState<any>(context?.data?.table || []);
  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [tax, setTax] = useState(0);

  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      name,
      qty,
      price,
      tax,
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
      <table className="min-w-full border-collapse text-gray-500 ">
        <thead>
          <tr className="bg-gray-100">
            <th className=" text-left px-10 py-2">ID</th>

            <th className=" text-left px-4 py-2">Qty</th>
            <th className=" text-left px-4 py-2">Price</th>
            <th className=" text-left px-4 py-2">Tax</th>
            <th className=" text-left px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any) => (
            <tr key={row.id}>
              <td className=" px-10 py-2">
                {row.id}
                {row.name}
              </td>
              <td className=" px-4 py-2">{row.qty}</td>
              <td className=" px-4 py-2">${row.price}</td>
              <td className=" px-4 py-2">${row.tax}</td>
              <td className=" px-4 py-2">
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
              <input
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 px-10 pl-3 py-1 w-full outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </td>
            <td className="">
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value))}
               className="border border-gray-300 px-2 pl-3 py-1 w-full outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </td>
            <td className="">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="border border-gray-300 px-2 pl-3 py-1 w-full outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </td>
            <td className="">
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(parseFloat(e.target.value))}
                className="border border-gray-300 px-2 pl-3 py-1 w-full outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={handleAddRow}
        className="bg-green-600 text-white px-4 py-2 rounded-full text-sm mt-4"
      >
        <i className="ri-add-line mr-2"></i>Add Item
      </button>
    </div>
  );
}
