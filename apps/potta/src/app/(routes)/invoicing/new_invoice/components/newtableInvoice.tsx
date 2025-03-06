import { useContext, useState } from "react";
import { ContextData } from '@potta/components/context';

export default function DynamicTable() {
    const context = useContext(ContextData);
    const [rows, setRows] = useState<any>(context?.data?.table || []);

    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState(0);
    const [tax, setTax] = useState(0);

    const handleAddRow = () => {
        const newRow = {
            id: rows.length + 1,
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
            <table className="min-w-full border-collapse text-gray-500 border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border text-left px-4 py-2">ID</th>
                        <th className="border text-left px-4 py-2">Qty</th>
                        <th className="border text-left px-4 py-2">Price</th>
                        <th className="border text-left px-4 py-2">Tax</th>
                        <th className="border text-left px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row: any) => (
                        <tr key={row.id}>
                            <td className="border px-4 py-2">{row.id}</td>
                            <td className="border px-4 py-2">{row.qty}</td>
                            <td className="border px-4 py-2">${row.price}</td>
                            <td className="border px-4 py-2">${row.tax}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => handleRemoveRow(row.id)} className="text-red-500">Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex">
                <div className="mb-2">
                    <label className="block text-sm font-thin">Qty</label>
                    <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(parseInt(e.target.value))}
                        className="border border-gray-300 px-2 outline-none pl-3 py-1 w-full"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-thin">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        className="border border-gray-300 px-2 outline-none pl-3 py-1 w-full"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-thin">Tax</label>
                    <input
                        type="number"
                        value={tax}
                        onChange={(e) => setTax(parseFloat(e.target.value))}
                        className="border border-gray-300 px-2 outline-none pl-3 py-1 w-full"
                    />
                </div>
            </div>

            <button
                onClick={handleAddRow}
                className="bg-green-500 text-white px-4 py-2 rounded-full text-sm mt-4"
            >
                Add
            </button>
        </div>
    );
}
