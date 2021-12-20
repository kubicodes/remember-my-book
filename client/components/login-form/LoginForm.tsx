import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Container, Form, Button } from "react-bootstrap";

const LoginForm: React.FC<{}> = () => {
  const router = useRouter();
  return (
    <Container id="main-container" className="d-grid h-100 mt-5">
      <Form id="sign-in-form" className="text-center p-3 w-100">
        <h1 className="mb-2 fs-3 fw-normal">Login</h1>
        <p>
          You don´t have an account?
          <br />
          Click{" "}
          <a
            className="link"
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/register")}
          >
            here{" "}
          </a>
          to register
        </p>
        <Form.Group controlId="sign-in-email-address">
          <Form.Control
            type="email"
            size="lg"
            placeholder="Email address"
            autoComplete="username"
            className="position-relative"
          />
        </Form.Group>
        <Form.Group className="mt-3" controlId="sign-in-password">
          <Form.Control
            type="password"
            size="lg"
            placeholder="Password"
            autoComplete="current-password"
            className="position-relative"
          />
        </Form.Group>
        <div className="d-grid mt-4">
          <Button variant="dark" size="lg">
            Login
          </Button>
        </div>
        <p className="mt-5 text-muted">&copy; 2021-2022</p>
      </Form>
    </Container>
  );
};

export default LoginForm;
