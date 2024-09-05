import React, { FC, useState } from "react";
import { Input, Select } from "@instanvi/ui-components";;
import PhoneInput from "react-phone-input-2";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import { countryList } from "@instanvi/utilities";
import { SelectProp } from "apps/home-app/src/utils/types";
import { OrganizationFormData } from "../../utils/validations";


type Props = {
  errors: FieldErrors<OrganizationFormData>;
  setValue: UseFormSetValue<OrganizationFormData>;
  register: UseFormRegister<OrganizationFormData>;
};

const AddressInfo: FC<Props> = ({ errors, register, setValue }) => {
  const [phone, setPhone] = useState("");

  const onChangePhone = (val: string) => {
    setPhone(val)
    setValue?.("phone", val);
  };

  const onChangeCountry = (val: SelectProp) => {
    const value = val;
    setValue?.("country", value?.value as string);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="w-full">
        <div>
          <h3 className="text-3xl text-center">Address Information</h3>
          <p className="text-gray-500 text-center text-md my-3">
            Complete the following step below to verify your account{" "}
          </p>
        </div>
        <div className="w-full mt-6  flex justify-center items-center h-full ">
          <div className="w-full border p-8 ">
            <section className="grid gap-5">
              <div>
                <label htmlFor="country" className="capitalize font-semibold text-[0.75rem]">Country</label>
                <Select
                  options={countryList}
                  onChange={(val) => onChangeCountry(val)}
                />
                {errors?.country ? (
                  <small className="col-span-2 text-red-500">
                    {errors?.country.message}
                  </small>
                ) : null}
              </div>

              <Input
                type="text"
                name="address"
                label="Address"
                register={register}
                placeholder={"Transport and logidtics"}
              />
              <div className="w-full grid gap-3 md:grid-cols-2 ">
                <Input
                  type="text"
                  name="state"
                  label="State"
                  register={register}
                  placeholder={"Littoral"}
                />
                <Input
                  type="text"
                  name="city"
                  label="City"
                  register={register}
                  placeholder={"Douala"}
                />
              </div>
              <Input
                type="number"
                name="postcode"
                label="Postal Code"
                register={register}
                placeholder={"00237"}
              />
              <div className="w-full">
                <label htmlFor="" className="capitalize font-semibold text-[0.75rem]">Business Phone Number</label>
                <PhoneInput
                  country={"cm"}
                  value={phone}
                  onChange={(value) => onChangePhone(value)}
                />
              </div>
              <Input
                type="email"
                name="email"
                label="Business Email"
                register={register}
                placeholder={"hello@yourcompany.com"}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddressInfo;
