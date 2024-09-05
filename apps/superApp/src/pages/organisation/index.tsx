import React, { useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUpdateOrganization } from "../../modules/auth/hooks/useUpdateOrganization";
import { OrganizationFormData, organizationSchema } from "../../modules/auth/utils/validations";

import CustomButton from "../../components/button/customButton";
import AddressInfo from "../../modules/auth/components/accountVerification/address-info";
import BusinessInfo from "../../modules/auth/components/accountVerification/business-info";
import IdentityInfo from "../../modules/auth/components/accountVerification/identity-info";


type Props = object;

const VerificationPage = (props: Props) => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);

  console.log(files)
  const { mutate, isPending } = useUpdateOrganization()

  const methods = useForm<OrganizationFormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      city: "",
      phone: "",
      email: "",
      state: "",
      country: "",
      address: "",
      website: "",
      industry: "",
      description: "",
      activity_type: "",
    },
    reValidateMode: "onChange",
    resolver: yupResolver(organizationSchema),
  });

  const { register, reset, setValue, handleSubmit, trigger } = methods;
  const { errors } = methods.formState;

  const handleNext = async () => {
    let isValid = false;
    switch (step) {
      case 0:
        isValid = await trigger(["count_of_employees_max", "count_of_employees_min", "industry", "name", "description", "website"]);
        break;
      case 1:
        isValid = await trigger(["country", "address", "state", "city", "postcode", "email", "phone"]);
        break;
      case 2:
        isValid = await trigger(["activity_type"])
        break;
    }
    if (isValid) {
      setStep(step + 1);
    }
  };

  const onSubmit: SubmitHandler<OrganizationFormData> = (inputs) => {
    // router.push("/auth/codeVerification");
    const payload = {
      ...inputs,
      documents: files as any,
      postcode: String(inputs?.postcode)
    }
    mutate(payload, {
      onSuccess: () => {
        router.push("/organisation/success-verification");
        reset();
      },
      onError: (error: unknown) => {
        const text = (error as AxiosError<{ message: string }>)?.response?.data
        const message = text?.message
        // toast.error(message as string);
      },
    })
  };

  // useEffect(() => {
  // }, [])

  return (
    <form className="mx-auto max-w-2xl p-6 lg:px-8">
      {step === 0 && (
        <BusinessInfo register={register} errors={errors} setValue={setValue} />
      )}
      {step === 1 && (
        <AddressInfo register={register} errors={errors} setValue={setValue} />
      )}
      {step === 2 && <IdentityInfo errors={errors} setValue={setValue} files={files} setFiles={setFiles} />}
      <div className="w-full flex justify-end mt-5">
        {step < 2 && (
          <CustomButton
            type="button"
            value={"Proceed"}
            icon={"arrow-right"}
            onclick={handleNext}
          />)}
        {step === 2 && (
          <CustomButton
            type="submit"
            value={"Proceed"}
            icon={"arrow-right"}
            onclick={handleSubmit(onSubmit)}
          />
        )}
      </div>
    </form>
  );
};

export default VerificationPage;
