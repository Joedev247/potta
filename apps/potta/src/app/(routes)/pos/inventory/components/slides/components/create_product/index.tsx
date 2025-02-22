import MyDropzone from '@potta/components/dropzone';
import Select from '@potta/components/select';
import React, { useContext, useState } from 'react';
import Inventory from './components/inventory';
import Unit from './components/units';
import Notes from './components/notes';
import Attachments from './components/attachments';
import Button from '@potta/components/button';
import { ContextData } from '@potta/components/context';
import Input from '@potta/components/input';
import Checkbox from '@potta/components/checkbox';
const CreateProduct = () => {
  const [data, setData] = useState('units');
  const context = useContext(ContextData);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unitOfMeasure, setUnitOfMeasure] = useState('');
  const [cost, setCost] = useState('');
  const [sku, setSku] = useState('');
  const [inventoryLevel, setInventoryLevel] = useState('');
  const [salesPrice, setSalesPrice] = useState('');
  const [taxable, setTaxable] = useState(false);
  const [taxRate, setTaxRate] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  const handleInputChange = (key: string, value: any) => {
    switch (key) {
      case 'name':
        setName(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'unitOfMeasure':
        setUnitOfMeasure(value);
        break;
      case 'cost':
        setCost(value);
        break;
      case 'sku':
        setSku(value);
        break;
      case 'inventoryLevel':
        setInventoryLevel(value);
        break;
      case 'salesPrice':
        setSalesPrice(value);
        break;
      case 'taxable':
        setTaxable(value);
        break;
      case 'taxRate':
        setTaxRate(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'image':
        setImage(value);
        break;
      default:
        break;
    }
    // Update context data
    context?.setData((prevData: any) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSaveproduct = () => {
    const formData = {
      name,
      description,
      unitOfMeasure,
      cost,
      sku,
      inventoryLevel,
      salesPrice,
      taxable,
      taxRate,
      category,
      image,
    };
    // Save to context
    context?.setData((prevData: any) => ({
      ...prevData,
      ...formData,
    }));

    // Log context data
    console.log('Context Data:', context?.data);
  };

  return (
    <div className="pr-8">
      <div className="w-full">
        <label htmlFor="name">Product/Service Name</label>
        <Input
          name="name"
          type={'text'}
          value={name}
          onchange={(e: any) => handleInputChange('name', e.target.value)}
        />
      </div>
      <div className="w-full grid mt-5 grid-cols-2 gap-2">
        <div className="w-full">
          <label htmlFor="category">Category</label>
          <Input
          name="category"
          type={'text'}
          value={category}
          onchange={(e: any) => handleInputChange('category', e.target.value)}
        />
        </div>
        <div className="w-full">
          <label htmlFor="cost">Cost</label>
          <Input
          name="cost"
          type={'number'}
          value={cost}
          onchange={(e: any) => handleInputChange('cost', e.target.value)}
        />
        </div>
      </div>
      <div className="w-full mt-5">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          value={description}
          className="border outline-none w-full mt-2 p-2"
          onChange={(e: any) => handleInputChange('description', e.target.value)}
        ></textarea>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-5">
        <div>
          <div>
            <label htmlFor="">Image</label>
            <MyDropzone />
          </div>
          <div className="mt-4">
            <label htmlFor="sku">SKU</label>
            <Input
              value={sku}
              name="sku"
              type='text'
              onchange={(e: any) => handleInputChange('sku', e.target.value)}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="mt-6">
          <label htmlFor="salesPrice">Sales Price</label>
            <Input
              value={salesPrice}
              name="salesPrice"
              type='number'
              onchange={(e: any) => handleInputChange('salesPrice', e.target.value)}
            />
          </div>
          <div className="mt-6 flex flex-col items-start ">
          <label htmlFor="taxable">Taxable</label>
            <Checkbox
              value={taxable}
              name="taxable"
              type='checkbox'
              onchange={(e: any) => setTaxable(!taxable) }

            />
          </div>
          {taxable && <div className="mt-6">
          <label htmlFor="taxRate">Tax Rate</label>
            <Input
              value={taxRate}
              name="taxRate"
              type='number'
              onchange={(e: any) => handleInputChange('taxRate', e.target.value)}
            />
          </div>}
        </div>
      </div>
      <div className="mt-12">
        <div className="flex ">
          <div
            onClick={() => setData('units')}
            className={`px-4 py-2 bg-green-50 cursor-pointer ${
              data == 'units' && 'border-b-2 border-green-500 text-green-500'
            }`}
          >
            <p>Units</p>
          </div>
          <div
            onClick={() => setData('inventory')}
            className={`px-4 py-2 bg-green-50 cursor-pointer ${
              data == 'inventory' &&
              'border-b-2 border-green-500 text-green-500'
            }`}
          >
            <p>Inventory</p>
          </div>
          <div
            onClick={() => setData('notes')}
            className={`px-4 py-2 bg-green-50 cursor-pointer ${
              data == 'notes' && 'border-b-2 border-green-500 text-green-500'
            }`}
          >
            <p>Notes</p>
          </div>
          <div
            onClick={() => setData('attachement')}
            className={`px-4 py-2 bg-green-50 cursor-pointer ${
              data == 'attachement' &&
              'border-b-2 border-green-500 text-green-500'
            }`}
          >
            <p>Attachements</p>
          </div>
        </div>
        <div className="mt-8">
          {data == 'inventory' && <Inventory />}
          {data == 'units' && <Unit />}
          {data == 'notes' && <Notes />}
          {data == 'attachement' && <Attachments />}
        </div>
      </div>
      <div className="w-full mt-16 flex justify-end">
        <div className="flex space-x-2">
          <div>
            <Button text={'Save and New'} theme="lightBlue" type={'submit'} />
          </div>
          <div>
            <Button text={'Save in Close'} type={'submit'} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateProduct;
