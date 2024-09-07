import React, { FC } from "react";
import { Select, Input } from "@instanvi/ui-components";;
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import { SelectProp } from "../../../../utils/types";
import { Industry } from "../../../../Arrays/Business";
import { OrganizationFormData } from "../../utils/validations";

const employeesList = [
  { value: '1-10', label: '1 - 10' },
  { value: '10-50', label: '10 - 50' },
  { value: '50-100', label: '50 - 100' },
]

type Props = {
  errors: FieldErrors<OrganizationFormData>;
  setValue: UseFormSetValue<OrganizationFormData>;
  register: UseFormRegister<OrganizationFormData>;
};

const BusinessInfo: FC<Props> = ({ register, errors, setValue }) => {

  const onChangeIndustry = (val: SelectProp) => {
    const value = val;
    setValue("industry", value?.value as string);
  };

  const onChangeEmployee = (val: SelectProp) => {
    const value = val?.value;
    const parts = value?.split("-");

    if (parts) {
      const firstNumber = parseInt(parts?.[0], 10);
      const lastNumber = parseInt(parts[1], 10);
      setValue("count_of_employees_min", firstNumber);
      setValue("count_of_employees_max", lastNumber);
    }
  };

  return (
    <section className="flex items-center justify-between">
      <div className="w-full">
        <div>
          <h3 className="text-3xl text-center">Business Information</h3>
          <p className="text-gray-500 text-center text-md my-3">
            Complete the following step below to verify your account
          </p>
        </div>
        <div className="w-full mt-6  flex justify-center items-center h-full ">
          <div className="w-full border p-8 ">
            <Input
              type="text"
              name="name"
              register={register}
              errors={errors?.name}
              label="Business Legal Name"
              placeholder={"Bickdrim LLC"}
            />

            <div>
              <label htmlFor="" className="capitalize font-semibold text-[0.75rem]">Industry</label>
              <Select
                options={Industry}
                onChange={(val) => onChangeIndustry(val)}
              />
              {errors?.industry ? (
                <small className="col-span-2 text-red-500">{errors?.industry?.message}</small>
              ) : null}
            </div>

            <Input
              isTextArea
              type="text"
              name="description"
              register={register}
              label="Description"
              errors={errors?.description}
              placeholder={"We are into ABC.."}
            />

            <div>
              <label htmlFor="" className="capitalize font-semibold text-[0.75rem]">Employees</label>
              <Select
                options={employeesList}
                onChange={(val) => onChangeEmployee(val)}
              />
              {errors?.count_of_employees_min ? (
                <small className="col-span-2 text-red-500">{errors?.count_of_employees_min?.message}</small>
              ) : null}
            </div>

            <Input
              type="url"
              name="website"
              register={register}
              errors={errors?.website}
              label="Website URL"
              placeholder={"bickdrim.com"}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessInfo;
