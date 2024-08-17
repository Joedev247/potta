import React, { FC } from "react";
import Select from "react-select";
import { useRouter } from "next/router";
import { OrganizationFormData } from "../../utils/validations";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { SelectProp } from "apps/home-app/src/utils/types";
import { BusinessType } from "apps/home-app/src/Arrays/Business";
import MyDropzone from "apps/home-app/src/components/dropzone";
import CustomButton from "apps/home-app/src/components/button/customButton";

type Props = {
  files: File[]
  setFiles: (arg: File[]) => void
  errors: FieldErrors<OrganizationFormData>;
  setValue: UseFormSetValue<OrganizationFormData>;
};

const IdentityInfo: FC<Props> = ({ errors, setValue, files, setFiles }) => {
  const router = useRouter();
  const onChangeType = (val: SelectProp) => {
    const value = val;
    setValue?.("activity_type", value?.value as string);
  };

  return (
    <section className="mx-auto flex max-w-4xl items-center justify-between p-6 lg:px-8">
      <div className="w-full">
        <div>
          <h3 className="text-3xl text-center">Identity Verification</h3>
          <p className="text-gray-500 text-center text-md my-3">
            Complete the following step below to verify your account
          </p>
        </div>
        <div className="w-full mt-6  flex justify-center items-center h-full ">
          <div className="w-full border p-8 ">
            <div className="w-full mt-10">
              <label htmlFor="">Industry</label>
              <Select options={BusinessType} onChange={(val) => onChangeType(val)} />
            </div>
            <div className="w-full mt-6">
              <label htmlFor="">Upload Incorporation Documents</label>
              <MyDropzone files={files} setFiles={setFiles} />
            </div>
            <div className="mt-5 px-4">
              <p>
                Upload a copy of your bank statement, utility bill, phone bill,
                tax assessment, or any government-issued document.
              </p>
              <ul className="list-disc">
                <li>All documents must be less than 3 months old</li>
                <li>
                  And must include the name of the identified individual or
                  business
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end mt-5">
          <CustomButton
            type="submit"
            value="Complete"
            icon="arrow-right"
          />
        </div>
      </div>
    </section>
  );
};
export default IdentityInfo;
