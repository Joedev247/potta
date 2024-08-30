import React, { useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { Select } from "@instanvi/ui-components";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import toast from "react-hot-toast/headless";
import { countryList } from '../../../utils';
import {
  RegisterFormData,
  registerSchema,
} from "../../../modules/auth/utils/validations";
import { Button, Checkbox, Input } from "@instanvi/ui-components";
import Layout from "../../../modules/auth/layout";
import { useRegister } from "../../../modules/auth/hooks/useRegister";

type SelectProp = SingleValue<{
  value: string;
  label: string;
}>;

const SignUp = () => {
  const [termsChecked, setTermsChecked] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const { isPending, mutate } = useRegister();

  const methods = useForm<RegisterFormData>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      country: "",
      name: "test name",
    },
    resolver: yupResolver(registerSchema),
  });

  const { handleSubmit, register, reset, setValue } = methods;
  const { errors } = methods.formState;

  const onSubmit: SubmitHandler<RegisterFormData> = (inputs) => {
    const data = {
      ...inputs,
      organization: {
        name: inputs.name,
        country: inputs.country,
      },
    };

    const { name, country, firstName, lastName, ...payload } = data;
    mutate(payload, {
      onSuccess: (data: unknown) => {
        console.log(data);
        toast.success("Data Registered successfully");
        reset();
      },
      onError: (error: unknown) => {
        const text = (error as AxiosError<{ message: string }>)?.response?.data
        const message = text?.message
        toast.error(message as string);
      },
    });
  };

  const onChangeCountry = (val: SelectProp) => {
    const value = val;
    setValue("country", value?.value as string);
  };

  const onTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsChecked(e.target.checked);
  };

  const onEmailCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailChecked(e.target.checked);
  };

  //=========== Component ================
  return (
    <Layout>
      <form
        className="h-screen w-full items-center flex justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mx-auto max-w-5xl relative px-4 sm:px-16 w-full 2xl:w-[35rem]">
          <div className="w-full md:px-3">
            <div className="w-full mb-5 text-left">
              <h3 className="text-2xl">Sign Up</h3>
              <p className="text-gray-400 my-2 text-[0.875rem]">
                Before we start, Please enter your current location
              </p>
            </div>
            <div className="grid gap-2">
              <div className="w-full">
                <label htmlFor="" className="font-semibold text-[0.75rem]">Country / Area of resident</label>
                <Select
                  onChange={(val) => onChangeCountry(val)}
                  options={countryList}
                  className="rounded-0 outline-none mt-2"
                />
                {errors?.country ? (
                  <small className="col-span-2 text-red-500">{errors?.country?.message}</small>
                ) : null}
              </div>
              <div className="w-full">
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  register={register}
                  errors={errors?.email}
                  placeholder="catherine.shaw@gmail.com"
                />
              </div>
              <div className=" w-full">
                <Input
                  name="password"
                  label="Password"
                  register={register}
                  errors={errors?.password}
                  placeholder="Password@123"
                />
              </div>

              <div className="my-3 grid gap-1">
                <Checkbox
                  name="agreements"
                  value={emailChecked}
                  onChange={onEmailCheckChange}
                  text="I agree to receive email updates"
                />
                <Checkbox
                  name="terms"
                  value={termsChecked}
                  onChange={onTermsChange}
                  text="I have read and agree to terms of services"
                />
              </div>
            </div>
            <div className="w-full mt-3 text-center">
              {isPending ? (
                <h3 className="text-green-600">Creating...</h3>
              ) : (
                <Button fullWidth type="submit" value={"Create Account"} />
              )}
            </div>
            <div className="absolute -bottom-20 flex space-x-2">
              <p className="font-thin ">Already registered ? </p>
              <Link className="text-[#0052FF] font-bold" href={"/auth/login"}>
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default SignUp;
