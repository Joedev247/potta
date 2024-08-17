import { FC } from "react";

interface Props {
  value: string;
  name: string;
}

const Checkbox: FC<Props> = ({ value, name }) => {
  return (
    <fieldset>
      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            id={name}
            name={name}
            type="checkbox"
            aria-describedby="comments-description"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
        </div>
        <div className="ml-3 text-sm leading-6">
          <label htmlFor={name} className="font-medium text-gray-900">
            {value}
          </label>{' '}
        </div>
      </div>
    </fieldset>
  );
};

export default Checkbox;