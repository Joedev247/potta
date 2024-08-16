import React, { FC, Fragment } from "react";
import Select from "react-select";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { OrganizationFormData } from "../../utils/validations";
import useVerificaton from "../../hooks/useVerification";
import Input from "../../../../components/input";
import { SelectProp } from "../../../../utils/types";
import { Industry } from "../../../../Arrays/Business";
import CustomButton from "../../../../components/button/customButton";

type Props = {
  errors: FieldErrors<OrganizationFormData>;
  setValue: UseFormSetValue<OrganizationFormData>;
  register: UseFormRegister<OrganizationFormData>;
};

const BusinessInfo: FC<Props> = ({ register, errors, setValue }) => {
  const { setActiveStep } = useVerificaton();

  const onChangeIndustry = (val: SelectProp) => {
    const value = val;
    setValue("industry", value?.value as string);
  };

  return (
    <Fragment>
      <div className="mx-auto flex max-w-4xl items-center justify-between p-6 lg:px-8">
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
              <div className="w-full mt-5">
                <label htmlFor="">Industry</label>
                <Select
                  options={Industry}
                  onChange={(val) => onChangeIndustry(val)}
                />
              </div>
              <div className="w-full mt-5">
                <Input
                  isTextArea
                  type="text"
                  name="description"
                  register={register}
                  label="Description"
                  errors={errors?.description}
                  placeholder={"We are into ABC.."}
                />
              </div>
              {/* <div className="w-full mt-6">
        <label htmlFor="">Industry</label>
        <Select options={Industry} />
      </div> */}
              {/* <Input
        type="url"
        name="website"
        register={register}
        errors={errors?.}
        label="Website URL"
        placeholder={"bickdrim.com"}
      /> */}
            </div>
          </div>
          <div className="w-full flex justify-end mt-5">
            <CustomButton
              value={"Proceed"}
              onclick={() => {
                setActiveStep?.(1);
              }}
              icon={"arrow-right"}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BusinessInfo;
