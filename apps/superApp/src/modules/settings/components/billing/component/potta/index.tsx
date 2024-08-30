import { FC } from 'react'
import { Button } from '@instanvi/ui-components'

const Potta: FC = () => {
  return (
    <div className=' '>
      <div className='mt-2'>
        <div className="flex justify-center">
          <div className="w-full max-w-6xl bg-white p-6">
            <table className="w-full text-sm font-light text-left">
              <thead className=" border-b uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3"></th>
                  <th scope="col" className="px-6 py-3">Starter</th>
                  <th scope="col" className="px-6 py-3">Growth</th>
                  <th scope="col" className="px-6 py-3">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap"><h4>Income, Vouchers & Expenses</h4></th>
                  <td className="px-6 py-4">
                    <i className="ri-checkbox-circle-fill text-green-700 text-xl"></i>
                  </td>
                  <td className="px-6 py-4">
                    <i className="ri-checkbox-circle-fill text-green-700 text-xl"></i>
                  </td>
                  <td className="px-6 py-4">
                    <i className="ri-checkbox-circle-fill text-green-700 text-xl"></i>
                  </td>
                </tr>
                <tr className="border-b">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap"><h4>Pay in Fees</h4></th>
                  <td className="px-6 py-4">2%</td>
                  <td className="px-6 py-4">2%</td>
                  <td className="px-6 py-4">3%</td>
                </tr>
                <tr className="border-b">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap"><h4>Pay Out Fees</h4></th>
                  <td className="px-6 py-4">1%</td>
                  <td className="px-6 py-4">1%</td>
                  <td className="px-6 py-4">Free</td>
                </tr>
                <tr className="border-b">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap"><h4>Virtual Cards</h4></th>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4">Unlimited</td>
                  <td className="px-6 py-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap"><h4>Physical cards</h4></th>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4">3</td>
                  <td className="px-6 py-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap"><h4>Policies</h4></th>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4">
                    <i className="ri-checkbox-circle-fill text-green-700 text-xl"></i>
                  </td>
                  <td className="px-6 py-4">
                    <i className="ri-checkbox-circle-fill text-green-700 text-xl"></i>
                  </td>
                </tr>
                <tr className="border-b">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap"><h4>Inventory</h4></th>
                  <td className="px-6 py-4">
                    <i className="ri-checkbox-circle-fill text-green-700 text-xl"></i>
                  </td>
                  <td className="px-6 py-4">
                    <i className="ri-checkbox-circle-fill text-green-700 text-xl"></i>
                  </td>
                  <td className="px-6 py-4">
                    <i className="ri-checkbox-circle-fill text-green-700 text-xl"></i>
                  </td>
                </tr>
                <tr className="border-b">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap"><h4>Users</h4></th>
                  <td className="px-6 py-4">2</td>
                  <td className="px-6 py-4">5</td>
                  <td className="px-6 py-4">5</td>
                </tr>
                <tr className="border-b">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap"></th>
                  <td className="px-6 py-4">
                    <Button value='XAF 24,000/MONTH' />
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-2 bg-blue-500 text-white font-medium hover:bg-blue-600">XAF 49,000/MONTH</button>

                  </td>
                  <td className="px-6 py-4">

                    <button className="px-4 py-2 bg-blue-500 text-white font-medium hover:bg-blue-600">XAF 99,000/MONTH</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Potta