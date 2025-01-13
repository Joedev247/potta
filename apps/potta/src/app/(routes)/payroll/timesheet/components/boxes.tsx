import React from 'react';

const data = [
    {
        id: 1,
        title: 'Total Hours',
        amount: '2600',
    },
    {
        id: 2,
        title: 'Total Overtime',
        amount: '2500',
    },
];

const Boxes = () => {
    return (
        <div className="grid grid-cols-5  gap-5">
            {data.map((item) => (
                <div key={item.id} className="border p-4">
                    <div className="flex w-full justify-center">
                        <p className='text-black text-lg'>{item.title}</p>
                    </div>
                    <div className="mb-8 mt-5 text-center text-3xl"> {item.amount}</div>
                </div>
            ))}
        </div>
    );
};

export default Boxes;
