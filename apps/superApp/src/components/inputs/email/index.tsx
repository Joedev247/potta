import { FC } from 'react'
import { EnvelopeIcon } from '@heroicons/react/20/solid'
import { FieldError, UseFormRegister } from 'react-hook-form';

type Props = {
  errors?: FieldError;
  register: UseFormRegister<any>;
};

const Email: FC<Props> = ({
  errors,
  register }) => {

  return (
    <div>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type="email"
          {...register("email")}
          placeholder="catherine.shaw@gmail.com"
          className="block w-full rounded-0 border py-2.5 pr-10 outline-none pl-3 text-gray-900  "
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3  ">
          <EnvelopeIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {errors ? (
        <small className="col-span-2 text-red-500">{errors?.message}</small>
      ) : null}
    </div>
  )
}
export default Email