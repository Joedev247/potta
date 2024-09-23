import React, { FC, useCallback } from "react";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { Select } from "@instanvi/ui-components";
import { SelectProp } from "../../../../utils/types";
import MyDropzone from "../../../../components/dropzone";
import { BusinessType } from "../../../../Arrays/Business";
import { OrganizationFormData } from "../../utils/validations";

type Props = {
  files: File[]
  setFiles: (arg: File[]) => void
  errors: FieldErrors<OrganizationFormData>;
  setValue: UseFormSetValue<OrganizationFormData>;
};

const IdentityInfo: FC<Props> = ({ errors, setValue, files, setFiles }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles([...files, ...acceptedFiles]);
  }, [files]);

  const onChangeType = (val: SelectProp) => {
    const value = val;
    setValue?.("activity_type", value?.value as string);
  };

  return (
    <section className="flex items-center justify-between">
      <div className="w-full">
        <div>
          <h3 className="text-3xl text-center">Identity Verification</h3>
          <p className="text-gray-500 text-center text-md my-3">
            Complete the following step below to verify your account
          </p>
        </div>
        <div className="w-full mt-6  flex justify-center items-center h-full ">
          <div className="w-full border p-8 grid gap-4">
            <div>
              <label htmlFor="" className="capitalize font-semibold text-[0.75rem]">Business Type</label>
              <Select options={BusinessType} onChange={(val) => onChangeType(val)} />
            </div>
            <div>
              <div className="grid gap-4">
                <label htmlFor="docs" className="capitalize font-semibold text-[0.75rem]">Upload Incorporation Documents</label>
                <div className="p-2 border">
                  <MyDropzone onDrop={onDrop} />
                </div>
              </div>
              {files?.map((file, i) => <p key={i}>{file.name}</p>)}
            </div>
            <div className="px-4">
              <small>
                Upload a copy of your bank statement, utility bill, phone bill,
                tax assessment, or any government-issued document.
              </small>
              <ul className="list-disc">
                <li>
                  <small>
                    All documents must be less than 3 months old
                  </small>
                </li>
                <li>
                  <small>
                    And must include the name of the identified individual or
                    business
                  </small>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
};
export default IdentityInfo;
