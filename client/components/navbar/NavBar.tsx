import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import NextLink from "next/link";

const NavBar: React.FC<{}> = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Remember My Name</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav style={{ marginLeft: "auto" }}>
            <NextLink href={"/login"}>
              <Nav.Link href="/login">Login</Nav.Link>
            </NextLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
