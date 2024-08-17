import { FC, useState } from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form';

interface Props {
  errors?: FieldError;
  register: UseFormRegister<any>;
  name: string
}

const Password: FC<Props> = ({ errors,
  register, name }) => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          id={name}
          autoComplete="none"
          type={open ? 'password' : 'text'}
          {...register(name)}
          placeholder="Password@123"
          className="block w-full rounded-0 border py-2.5 outline-none  pr-10 text-gray-900 pl-3"
        />
        <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center px-3" onClick={() => setOpen(!open)}>
          {
            open ? <i className="ri-eye-fill text-gray-500 text-xl" />
              : <i className="ri-eye-off-fill text-gray-500 text-xl" />
          }
        </div>
      </div>
      {errors ? (
        <small className="col-span-2 text-red-500">{errors?.message}</small>
      ) : null}
    </div>
  )
}
export default Password