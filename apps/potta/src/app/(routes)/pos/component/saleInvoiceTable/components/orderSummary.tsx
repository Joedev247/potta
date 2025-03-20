import React from 'react';
import ModalCoupon from './modalCoupon';
import HoldOrderButton from './holdOn';

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  itemDiscounts: number; // Added item-level discounts
  tax: number;
  total: number;
  setDiscount: (amount: number) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  discount,
  itemDiscounts,
  tax,
  total,
  setDiscount,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Calculate the total discount (item-level + order-level)
  const totalDiscount = discount + itemDiscounts;

  return (
    <div>
      <div>
        <button
          className="px-4 py-3 flex items-center text-purple-400 border-purple-400 border hover:bg-purple-400 hover:text-white shadow-md"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="ri-coupon-3-line mr-2 text-xl"></i>Add Coupon
        </button>
        <ModalCoupon
          open={isModalOpen}
          setOpen={setIsModalOpen}
          onApplyCoupon={(amount) => setDiscount(amount)}
        />
      </div>
      <div className="mt-4 w-full flex justify-between">
        <HoldOrderButton />
        <div className="w-1/2">
          <div className="w-full flex justify-end ">
            <div className="w-96 flex-col space-y-2">
              <div className="w-full flex justify-between border-b py-2">
                <span className="font-thin">Subtotal</span>
                <p className="font-semibold text-lg">${subtotal.toFixed(2)}</p>
              </div>

              {/* Show item discounts if any */}
              {itemDiscounts > 0 && (
                <div className="w-full flex justify-between border-b py-2">
                  <span className="font-thin">Item Discounts</span>
                  <p className="font-semibold text-red-500 text-lg">
                    -${itemDiscounts.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Show coupon discount if any */}
              {discount > 0 && (
                <div className="w-full flex justify-between border-b py-2">
                  <span className="font-thin">Coupon Discount</span>
                  <p className="font-semibold text-red-500 text-lg">
                    -${discount.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Show total discount row only if there are discounts */}
              {totalDiscount > 0 && (
                <div className="w-full flex justify-between border-b py-2">
                  <span className="font-thin">Total Discount</span>
                  <p className="font-semibold text-red-500 text-lg">
                    -${totalDiscount.toFixed(2)}
                  </p>
                </div>
              )}

              <div className="w-full flex justify-between py-2 border-b">
                <span className="font-thin">Tax</span>
                <p className="font-semibold text-lg">${tax.toFixed(2)}</p>
              </div>
              <div className="w-full flex justify-between py-2 border-b">
                <span className="font-thin">Total</span>
                <p className="font-semibold text-lg">${total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            {/* Print button section if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
