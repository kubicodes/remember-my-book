import { useRouter } from "next/router";
import React from "react";
import { Container, Form, Button } from "react-bootstrap";

const RegisterForm: React.FC<{}> = () => {
  const router = useRouter();

  return (
    <Container id="main-container" className="d-grid h-100 mt-5">
      <Form id="sign-in-form" className="text-center p-3 w-100">
        <h1 className="mb-2 fs-3 fw-normal">Create Account</h1>
        <p>
          Already have an account?
          <br />
          <a
            className="link"
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/login")}
          >
            here{" "}
          </a>
          to login
        </p>
        <Form.Group controlId="sign-in-email-address" className="mb-3">
          <Form.Control
            type="email"
            size="lg"
            placeholder="Email address"
            autoComplete="username"
            className="position-relative"
          />
        </Form.Group>
        <Form.Group controlId="sign-in-username">
          <Form.Control
            type="text"
            size="lg"
            placeholder="Username"
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
            Register
          </Button>
        </div>
        <p className="mt-5 text-muted">&copy; 2021-2022</p>
      </Form>
    </Container>
  );
};

export default RegisterForm;
