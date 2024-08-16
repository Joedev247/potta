function Wallet(){
    return (
<div className="w-full relative overflow-x-auto grid  justify-items-center">
    <table className="w-9/12 m-5 mx-12">
        <thead className="text-lg font-bold uppercase">
            <tr>
                <th scope="col" className="px-6 py-3">
                </th>
                <th scope="col" className="border-l px-6 py-3">
                    STERTER
                </th>
                <th scope="col" className="border-l px-6 py-3">
                    GROWTH
                </th>
                <th scope="col" className="border-l px-6 py-3">
                    ENTERPRISE
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="border-b border-t">
                <th scope="row" className="px-12 text-left font-medium whitespace-nowrap">
                    Income & Expenses
                </th>
                <td className="border-l px-6 py-4">
                    <div className="w-full text-center">
                        <i className="ri-checkbox-circle-fill text-green-700 text-green-700"></i>
                    </div>
                </td>
                <td className="border-l px-6 py-4">
                    <div className="w-full text-center">
                        <i className="ri-checkbox-circle-fill text-green-700 text-green-700"></i>
                    </div>
                </td>
                <td className="border-l px-6 py-4">
                    <div className="w-full text-center">
                        <i className="ri-checkbox-circle-fill text-green-700 text-green-700"></i>
                    </div>
                </td>
            </tr>
            <tr className="border-b">
                <th scope="row" className="px-12 text-left font-medium whitespace-nowrap">
                    Pay In Fees
                </th>
                <td className="border-l px-6 py-4 text-center">
                    2%
                </td>
                <td className="border-l px-6 py-4 text-center">
                    2%
                </td>
                <td className="border-l px-6 py-4 text-center">
                    3%
                </td>
            </tr>
            <tr className="border-b">
                <th scope="row" className="px-12 text-left font-medium whitespace-nowrap">
                    Pay Out Fees
                </th>
                <td className="border-l px-6 py-4 text-center">
                    1%
                </td>
                <td className="border-l px-6 py-4 text-center">
                    1%
                </td>
                <td className="border-l px-6 py-4 text-center">
                    Free
                </td>
            </tr>
            <tr className="border-b">
                <th scope="row" className="px-12 text-left font-medium whitespace-nowrap">
                    Virtual Cards
                </th>
                <td className="border-l px-6 py-4 text-center">

                </td>
                <td className="border-l px-6 py-4 text-center">
                    Unlimited
                </td>
                <td className="border-l px-6 py-4 text-center">
                    Unlimited
                </td>
            </tr>
            <tr className="border-b">
                <th scope="row" className="px-12 text-left font-medium whitespace-nowrap">
                    Physical Cards
                </th>
                <td className="border-l px-6 py-4 text-center">
                    
                </td>
                <td className="border-l px-6 py-4 text-center">
                    3
                </td>
                <td className="border-l px-6 py-4 text-center">
                    Unlimited
                </td>
            </tr>
            <tr className="border-b">
                <th scope="row" className="px-12 text-left font-medium whitespace-nowrap">
                    Policies
                </th>
                <td className="border-l px-6 py-4">
                    
                </td>
                <td className="border-l px-6 py-4">
                    <div className="w-full text-center">
                        <i className="ri-checkbox-circle-fill text-green-700"></i>
                    </div>
                </td>
                <td className="border-l px-6 py-4">
                    <div className="w-full text-center">
                        <i className="ri-checkbox-circle-fill text-green-700"></i>
                    </div>
                </td>
            </tr>
            <tr className="border-b">
                <th scope="row" className="px-12 text-left font-medium whitespace-nowrap">
                    Inventory
                </th>
                <td className="border-l px-6 py-4">
                    <div className="w-full text-center">
                        <i className="ri-checkbox-circle-fill text-green-700"></i>
                    </div>
                </td>
                <td className="border-l px-6 py-4">
                    <div className="w-full text-center">
                        <i className="ri-checkbox-circle-fill text-green-700"></i>
                    </div>
                </td>
                <td className="border-l px-6 py-4">
                    <div className="w-full text-center">
                        <i className="ri-checkbox-circle-fill text-green-700"></i>
                    </div>
                </td>
            </tr>
            <tr className="border-b">
                <th scope="row" className="px-12 text-left font-medium whitespace-nowrap">
                    Users
                </th>
                <td className="border-l px-6 py-4 text-center">
                    2
                </td>
                <td className="border-l px-6 py-4 text-center">
                    5
                </td>
                <td className="border-l px-6 py-4 text-center">
                    5
                </td>
            </tr>
            <tr>
                <th scope="row" className="px-12 text-left font-medium whitespace-nowrap">
                    
                </th>
                <td className="border-l px-6 py-4 text-center">
                    <button type="button" className="text-white bg-[#0E9F6E] hover:bg-[#046C4E]/90 font-medium text-sm px-5 py-3 text-center">
                    XAF 24,000/MONTH
                    </button>
                </td>
                <td className="border-l px-6 py-4 text-center">
                    <button type="button" className="text-white bg-[#3F83F8] hover:bg-[#1A56DB]/90 font-medium text-sm px-5 py-3 text-center">
                    XAF 49,000/MONTH
                    </button>
                </td>
                <td className="border-l px-6 py-4 text-center">
                    <button type="button" className="text-white bg-[#3F83F8] hover:bg-[#1A56DB]/90 font-medium text-sm px-5 py-3 text-center">
                    XAF 99,000/MONTH
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</div>

    );
};

export default Wallet