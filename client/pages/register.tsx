import { NextPage } from "next";
import React from "react";
import Layout from "../components/layout/Layout";
import RegisterForm from "../components/register-form/RegisterForm";

const Register: NextPage = () => {
  return (
    <>
      <Layout />
      <RegisterForm />
    </>
  );
};

export default Register;
