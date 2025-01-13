import Button from "@/components/button";
import React, { useContext } from "react";
import { ContextData } from "@/components/context";

const SaleInvoiceButons = () => {
    const context = useContext(ContextData)

    return (
        <div className="w-full p-3   grid grid-cols-4 gap-1">
            <div className="flex flex-col space-y-3">
                <Button onClick={() => { context?.setItemSelected('cart') }} height={true} width="full" theme={context?.itemSelected == 'cart' ? 'gray' : 'white'} color text={'cart'} type={"submit"} icon={<i className="ri-shopping-cart-line text-2xl mr-2"></i>} />
            </div>
            <div className="flex flex-col space-y-3">
                <Button onClick={() => { context?.setItemSelected('cash') }} height={true} width="full" theme={context?.itemSelected == 'cash' ? 'gray' : 'white'} color text={'PayCash'} icon={<i className="ri-money-euro-box-line text-2xl mr-2"></i>} type={"submit"} />
            </div>
            <div className="flex flex-col space-y-3">
                <Button onClick={() => { context?.setItemSelected('other') }} height={true} width="full" theme={context?.itemSelected == 'other' ? 'gray' : 'white'} color text={'OtherMethod'} icon={<i className="ri-wallet-2-line text-2xl mr-2"></i>} type={"submit"} />
            </div>
            <div className="flex flex-col space-y-3">
                <Button onClick={() => { context?.setItemSelected('calculate') }} height={true} width="full" theme={context?.itemSelected == 'calculate' ? 'gray' : 'white'} color text={'Calculate'} icon={<i className="ri-calculator-line text-2xl mr-2"></i>} type={"submit"} />
            </div>
        </div>
    )
}
export default SaleInvoiceButons