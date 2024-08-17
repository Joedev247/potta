import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import useVerificaton from "../../modules/auth/hooks/useVerification";
import { useUpdateOrganization } from "../../modules/auth/hooks/useUpdateOrganization";
import { OrganizationFormData, organizationSchema } from "../../modules/auth/utils/validations";
import { AxiosError } from "axios";
import BusinessInfo from "../../modules/auth/components/accountVerification/business-info";
import AddressInfo from "../../modules/auth/components/accountVerification/address-info";
import IdentityInfo from "../../modules/auth/components/accountVerification/identity-info";


type Props = object;

const VerificationPage = (props: Props) => {
  const router = useRouter();
  const { activeStep } = useVerificaton();
  const [files, setFiles] = useState<File[]>([]);
  const { mutate, isPending } = useUpdateOrganization()

  const methods = useForm<OrganizationFormData>({
    mode: "onChange",
    resolver: yupResolver(organizationSchema),
  });

  const { register, reset, setValue, handleSubmit } = methods;
  const { errors } = methods.formState;

  const onSubmit: SubmitHandler<OrganizationFormData> = (inputs) => {
    // router.push("/auth/codeVerification");
    const payload = {
      ...inputs,
      documents: files as any,
      postcode: String(inputs?.postcode)
    }
    mutate(payload, {
      onSuccess: () => {
        router.push("/accountVerification/successVerification");
        reset();
      },
      onError: (error: unknown) => {
        const text = (error as AxiosError<{ message: string }>)?.response?.data
        const message = text?.message
        // toast.error(message as string);
      },
    })
  };

  useEffect(() => {
    reset(({
      country: "",
      phone: "",
      email: "",
    }))
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {activeStep === 0 && (
        <BusinessInfo register={register} errors={errors} setValue={setValue} />
      )}
      {activeStep === 1 && (
        <AddressInfo register={register} errors={errors} setValue={setValue} />
      )}
      {activeStep === 2 && <IdentityInfo errors={errors} setValue={setValue} files={files} setFiles={setFiles} />}
    </form>
  );
};

export default VerificationPage;
