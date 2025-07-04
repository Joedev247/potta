import React, { useState } from 'react';
import Slideover from '@potta/components/slideover';
import ProductCreateStep from './ProductCreateStep';
import ProductUploadStep from './ProductUploadStep';
import Button from '@potta/components/button';

interface ProductStepperModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onComplete?: () => void;
}

const ProductStepperModal: React.FC<ProductStepperModalProps> = ({
  open,
  setOpen,
  onComplete,
}) => {
  const [active, setActive] = useState<'create' | 'confirm' | 'upload'>(
    'create'
  );
  const [productId, setProductId] = useState<string | null>(null);

  // After product creation, go to confirm step
  const handleProductCreated = (id: string) => {
    setProductId(id);
    setActive('confirm');
  };

  // Confirmation step: ask if user wants to upload images
  const handleConfirm = (upload: boolean) => {
    if (upload) {
      setActive('upload');
    } else {
      setOpen(false);
      if (onComplete) onComplete();
    }
  };

  // After upload, close modal
  const handleUploadComplete = () => {
    setOpen(false);
    if (onComplete) onComplete();
  };

  return (
    <Slideover open={open} setOpen={setOpen} edit={true} title="Add Product">
      <div className="w-full flex min-h-[60vh]">
        {/* Stepper */}
        <div className="w-[12%] space-y-7 border-r">
          <div onClick={() => setActive('create')}>
            <p
              className={`whitespace-nowrap ${
                active === 'create' && 'text-green-700 font-semibold'
              } cursor-pointer text-left`}
            >
              Create Product
            </p>
          </div>
          <div onClick={() => productId && setActive('confirm')}>
            <p
              className={`whitespace-nowrap ${
                ['confirm', 'upload'].includes(active) &&
                'text-green-700 font-semibold'
              } cursor-pointer text-left ${!productId && 'opacity-50'}`}
            >
              Upload Images
            </p>
          </div>
        </div>
        {/* Content */}
        <div className="w-full overflow-y-auto h-[calc(70vh)] pt-0 relative flex flex-col">
          <div className="w-full overflow-auto">
            {active === 'create' && (
              <ProductCreateStep
                onSuccess={handleProductCreated}
                onCancel={() => setOpen(false)}
              />
            )}
            {active === 'confirm' && (
              <div className="p-8 flex flex-col items-center justify-center">
                <h2 className="text-lg font-bold mb-4">Product Created!</h2>
                <p className="mb-6">
                  Would you like to upload images for this product?
                </p>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    text={'Yes, Upload Images'}
                    className="btn btn-primary"
                    onClick={() => handleConfirm(true)}
                  />

                  <Button
                    type="button"
                    text={'No, Finish'}
                    theme="gray"
                    className="btn btn-secondary"
                    onClick={() => handleConfirm(false)}
                  />
                </div>
              </div>
            )}
            {active === 'upload' && productId && (
              <ProductUploadStep
                productId={productId}
                onComplete={handleUploadComplete}
              />
            )}
          </div>
        </div>
      </div>
    </Slideover>
  );
};

export default ProductStepperModal;
