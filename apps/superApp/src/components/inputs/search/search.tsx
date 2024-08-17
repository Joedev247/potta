import { ChangeEvent, FC } from 'react';

interface Props {
  value: string;
  rounded?: boolean;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Search: FC<Props> = ({ onChange, value, placeholder, rounded }) => {
  return (
    <>
      <div
        className={`flex items-center gap-x-3 border ${rounded ? "rounded-full" : ""} px-4 w-full md:w-full `}
      >
        <i className="ri-search-line text-xl" />
        <input
          id="search"
          name="search"
          type="search"
          value={value}
          autoComplete="off"
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full py-2.5 ${rounded ? "rounded-full" : ""} outline-none pl-1`}
        />
      </div>
    </>
  )
}

export default Search;