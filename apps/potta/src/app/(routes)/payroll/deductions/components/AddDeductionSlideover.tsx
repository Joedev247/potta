import React, { useState } from 'react';
import Slider from '@potta/components/slideover';
import Input from '@potta/components/input';
import Button from '@potta/components/button';
import SearchableSelect from '@potta/components/searchableSelect';
import Checkbox from '@potta/components/checkbox';
import { useCreateDeduction } from '../hooks/useCreateDeduction';
import toast from 'react-hot-toast';

const typeOptions = [
  { label: 'Standard', value: 'Standard' },
  { label: 'Custom', value: 'Custom' },
];
const modeOptions = [
  { label: 'Fixed', value: 'Fixed' },
  { label: 'Percentage', value: 'Percentage' },
];
const appliesToOptions = [
  { label: 'Salary', value: 'Salary' },
  { label: 'Bonus', value: 'Bonus' },
];

const AddDeductionSlideover = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Standard');
  const [mode, setMode] = useState('Fixed');
  const [value, setValue] = useState('');
  const [isTax, setIsTax] = useState(false);
  const [appliesTo, setAppliesTo] = useState('Salary');
  const [isActive, setIsActive] = useState(true);
  const [isEditable, setIsEditable] = useState(true);
  const [brackets, setBrackets] = useState([{ min: 0, max: 0, rate: 0 }]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const createDeduction = useCreateDeduction();

  const handleAddBracket = () => {
    setBrackets([...brackets, { min: 0, max: 0, rate: 0 }]);
  };
  const handleBracketChange = (
    idx: number,
    field: string,
    val: string | number
  ) => {
    setBrackets(
      brackets.map((b, i) => (i === idx ? { ...b, [field]: val } : b))
    );
  };
  const handleRemoveBracket = (idx: number) => {
    setBrackets(brackets.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    if (!name) return setFormErrors({ name: 'Name is required' });
    if (!type) return setFormErrors({ type: 'Type is required' });
    if (!mode) return setFormErrors({ mode: 'Mode is required' });
    if (!value || isNaN(Number(value)))
      return setFormErrors({ value: 'Value is required and must be a number' });
    setLoading(true);
    try {
      await createDeduction.mutateAsync({
        name,
        description,
        type,
        mode,
        value: Number(value),
        brackets,
        is_tax: isTax,
        applies_to: appliesTo,
        is_active: isActive,
        is_editable: isEditable,
      });
      toast.success('Deduction created successfully!');
      setOpen(false);
      setName('');
      setDescription('');
      setType('Standard');
      setMode('Fixed');
      setValue('');
      setIsTax(false);
      setAppliesTo('Salary');
      setIsActive(true);
      setIsEditable(true);
      setBrackets([{ min: 0, max: 0, rate: 0 }]);
      setFormErrors({});
    } catch (err) {
      toast.error('Failed to create deduction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Slider
      edit={false}
      buttonText="deductions"
      open={open}
      setOpen={setOpen}
      title="Add Deduction"
      sliderClass="justify-start items-start left-0 max-w-2xl"
      sliderContentClass="justify-start items-start left-0 max-w-2xl"
    >
      <form
        className="grid grid-cols-2 gap-4 w-full p-4"
        onSubmit={handleSubmit}
      >
        <div className="col-span-2">
          <Input
            label="Name"
            type="text"
            name="name"
            value={name}
            onchange={(e) => setName(e.target.value)}
            required
            errors={formErrors.name}
          />
        </div>
        <div className="col-span-2">
          <Input
            label="Description"
            type="text"
            name="description"
            value={description}
            onchange={(e) => setDescription(e.target.value)}
            errors={formErrors.description}
          />
        </div>
        <SearchableSelect
          label="Type"
          options={typeOptions}
          selectedValue={type}
          onChange={setType}
          required
          error={formErrors.type}
          placeholder="Select type"
        />
        <SearchableSelect
          label="Mode"
          options={modeOptions}
          selectedValue={mode}
          onChange={setMode}
          required
          error={formErrors.mode}
          placeholder="Select mode"
        />
        <Input
          label="Value"
          name="value"
          type="number"
          value={value}
          onchange={(e) => setValue(e.target.value)}
          required
          errors={formErrors.value}
          min={0}
        />
        <SearchableSelect
          label="Applies To"
          options={appliesToOptions}
          selectedValue={appliesTo}
          onChange={setAppliesTo}
          required
          error={formErrors.appliesTo}
          placeholder="Select applies to"
        />
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Brackets</label>
          {brackets.map((b, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <Input
                label="Min"
                type="number"
                name={`min-${idx}`}
                value={b.min}
                onchange={(e) =>
                  handleBracketChange(idx, 'min', Number(e.target.value))
                }
                min={0}
              />
              <Input
                label="Max"
                type="number"
                name={`max-${idx}`}
                value={b.max}
                onchange={(e) =>
                  handleBracketChange(idx, 'max', Number(e.target.value))
                }
                min={0}
              />
              <Input
                label="Rate"
                type="number"
                name={`rate-${idx}`}
                value={b.rate}
                onchange={(e) =>
                  handleBracketChange(idx, 'rate', Number(e.target.value))
                }
                min={0}
              />
              {brackets.length > 1 && (
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => handleRemoveBracket(idx)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="text-blue-600 mt-1"
            onClick={handleAddBracket}
          >
            Add Bracket
          </button>
        </div>
        <div className="col-span-2 flex gap-4 mt-2">
          <Checkbox
            id="isTax"
            label="Is Tax"
            checked={isTax}
            onChange={setIsTax}
          />
          <Checkbox
            id="isActive"
            label="Active"
            checked={isActive}
            onChange={setIsActive}
          />
          <Checkbox
            id="isEditable"
            label="Editable"
            checked={isEditable}
            onChange={setIsEditable}
          />
        </div>
        <div className="col-span-2 w-full flex justify-end mt-8">
          <Button
            text="Save Deduction"
            type="submit"
            isLoading={loading}
            disabled={loading}
          />
        </div>
      </form>
    </Slider>
  );
};

export default AddDeductionSlideover;
