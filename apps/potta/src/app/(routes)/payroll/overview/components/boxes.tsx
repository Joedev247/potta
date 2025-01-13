import React from 'react';

const data = [
    {
        id: 1,
        title: 'Total Due Payroll',
        amount: 'XAF 849,000',
        color: '#000',
        percentage: '37.9',
    },
    {
        id: 2,
        title: 'Next Pay Date',
        amount: '13 th Oct 2025',
        color: '#FF9500',
        percentage: '34.1',
    },

];

const Boxes = () => {
    return (
        <div className="grid grid-cols-3 gap-5">
            {data.map((item) => (
                <div key={item.id} className="border p-4">
                    <div className="flex w-full justify-between">
                        <p style={{ color: item.color }} >{item.title}</p>
                        <button className="text-white py-0 px-1.5 rounded-full text-[10px] bg-green-400">
                            {item.percentage} %
                        </button>
                    </div>

                    <div className="mb-4 mt-5 text-center text-xl">{item.amount}</div>
                </div>
            ))}
        </div>
    );
};

export default Boxes;
