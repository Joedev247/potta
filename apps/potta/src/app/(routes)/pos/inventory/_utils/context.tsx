import React, { createContext, useContext, useState } from 'react';
import { Product } from './types';

interface InventoryContextType {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <InventoryContext.Provider value={{ selectedProduct, setSelectedProduct }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
