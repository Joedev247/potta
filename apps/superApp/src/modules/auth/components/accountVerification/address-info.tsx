import React, { FC, useState } from "react";
import { Select } from "@instanvi/ui-components";;
import PhoneInput from "react-phone-input-2";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { OrganizationFormData } from "../../utils/validations";
import useVerificaton from "../../hooks/useVerification";
import {SelectProp} from "../../../../utils/types";
import {countryList} from "../../../../utils";
import CustomButton from "../../../../components/button/customButton";
import Input from "../../../../components/input";
// import { SelectProp } from "apps/home-app/src/utils/types";
// import { countryList } from "apps/home-app/src/utils";
// import Input from "apps/home-app/src/components/input";
// import CustomButton from "apps/home-app/src/components/button/customButton";

type Props = {
  errors: FieldErrors<OrganizationFormData>;
  setValue: UseFormSetValue<OrganizationFormData>;
  register: UseFormRegister<OrganizationFormData>;
};

const AddressInfo: FC<Props> = ({ errors, register, setValue }) => {
  const { setActiveStep } = useVerificaton();
  const [phone, setPhone] = useState("");

  const onChangeCountry = (val: SelectProp) => {
    const value = val;
    setValue?.("country", value?.value as string);
  };

  return (
    <div className="mx-auto flex max-w-4xl items-center justify-between p-6 lg:px-8">
      <div className="w-full">
        <div>
          <h3 className="text-3xl text-center">Address Information</h3>
          <p className="text-gray-500 text-center text-md my-3">
            Complete the following step below to verify your account{" "}
          </p>
        </div>
        <div className="w-full mt-6  flex justify-center items-center h-full ">
          <div className="w-full border p-8 ">
            <section className="grid gap-6">
              <div className="w-full">
                <label htmlFor="country">Country</label>
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
                name="website"
                register={register}
                label="Business Legal Name"
                placeholder={"Bickdrim LLC"}
              />
              <div className="w-full mt-6">
                <Input
                  type="text"
                  name="address"
                  label="Address"
                  register={register}
                  placeholder={"Long street"}
                />
              </div>
              <div className="w-full grid gap-3 md:grid-cols-2 ">
                <div className="w-full mt-6">
                  <Input
                    type="text"
                    name="state"
                    label="State"
                    register={register}
                    placeholder={"Bickdrim LLC"}
                  />
                </div>
                <div className="w-full mt-6">
                  <Input
                    type="text"
                    name="city"
                    label="City"
                    register={register}
                    placeholder={"Bickdrim LLC"}
                  />
                </div>
              </div>
              <div className="w-full mt-6">
                <label htmlFor="">Postal Code</label>
                <Input
                  type="number"
                  name="postcode"
                  label="Postal Code"
                  register={register}
                  placeholder={"00237"}
                />
              </div>
              <div className="w-full mt-6">
                <label htmlFor="">Business Phone Number</label>
                <PhoneInput
                  country={"cm"}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                />
              </div>
              <div className="w-full mt-6">
                <label htmlFor="">Business Email</label>
                <Input
                  type="email"
                  name="email"
                  label="Business Email"
                  register={register}
                  placeholder={"bickdrim@example.com"}
                />
              </div>
            </section>
          </div>
        </div>
        <div className="w-full flex justify-end mt-5">
          <CustomButton
            value={"Proceed"}
            onclick={() => setActiveStep?.(2)}
            icon={"arrow-right"}
          />
        </div>
      </div>
    </div>
  );
};
export default AddressInfo;
