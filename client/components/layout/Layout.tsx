import React from "react";
import { Container } from "react-bootstrap";
import NavBar from "../navbar/NavBar";

const Layout: React.FC<{}> = ({ children }) => {
  return (
    <>
      <NavBar />
      <Container>{children}</Container>
    </>
  );
};

export default Layout;
