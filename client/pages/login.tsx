import { NextPage } from "next";
import React from "react";
import Layout from "../components/layout/Layout";
import LoginForm from "../components/login-form/LoginForm";

const Login: NextPage = () => {
  return (
    <>
      <Layout />
      <LoginForm />
    </>
  );
};

export default Login;
