import React from "react";
import Link from "next/link";
import Select, { SingleValue } from "react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

// Import the countryList from the correct path
// Assuming the utils folder is at the same level as the current file
import Email from "../../../components/inputs/email";
import Password from "../../../components/inputs/password";
import Proceed from "../../../components/button/submitButton";
import Layout from "../../../modules/auth/components/layout";
import { useRegister } from "../../../modules/auth/hooks/useRegister";
import {
  RegisterFormData,
  registerSchema,
} from "../../../modules/auth/utils/validations";
import toast from "react-hot-toast/headless";
import { AxiosError } from "axios";
import { countryList } from '../../../utils';

type SelectProp = SingleValue<{
  value: string;
  label: string;
}>;


const SignUp = () => {
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

  //=========== component ================
  return (
    <Layout>
      <form
        className="h-screen w-full items-center flex justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mx-auto max-w-5xl relative   px-4 sm:px-16 lg:px-32 w-full">
          <div className="w-full md:px-3">
            <div className="w-full  text-left">
              <h3 className="text-3xl">Sign Up</h3>
              <p className="text-gray-400 my-2">
                Before we start, Please enter your current location
              </p>
            </div>
            <div className="mt-8 w-full">
              <label htmlFor="">Country / Area of resident</label>
              <Select
                onChange={(val) => onChangeCountry(val)}
                options={countryList}
                className="rounded-0 outline-none mt-2"
              />
            </div>
            <div className="mt-5 w-full">
              <label htmlFor="">Email</label>
              <Email register={register} errors={errors?.email} />
            </div>
            <div className="mt-5 w-full">
              <label htmlFor="">Password</label>
              <Password id="password" register={register} errors={errors?.password} />
            </div>
            <div className="relative mt-5  flex items-start">
              <div className="flex h-6 items-center">
                <input
                  id="agreements"
                  name="agreements"
                  type="checkbox"
                  aria-describedby="agreements-description"
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label
                  htmlFor="agreements"
                  className="font-medium  cursor-pointer text-gray-900"
                >
                  I agree to receive email updates
                </label>
              </div>
            </div>
            <div className="relative mt-5  flex items-start">
              <div className="flex h-6 items-center">
                <input
                  id="Terms"
                  name="Terms"
                  type="checkbox"
                  aria-describedby="Terms-description"
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label
                  htmlFor="Terms"
                  className="font-medium  cursor-pointer text-gray-900"
                >
                  I have read ang agree to terms of services
                </label>
              </div>
            </div>
            <div className="w-full mt-8 text-center">
              {isPending ? (
                <h3>Creating...</h3>
              ) : (
                <Proceed value={"Create Account"} type="submit" />
              )}
            </div>
            <div className="mt-8 flex space-x-2">
              <p className="font-thin ">Already Register ? </p>
              <Link className="text-blue-500" href={"/auth/login"}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default SignUp;
