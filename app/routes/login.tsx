import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createUserSession, getSession, getUserId } from "~/services/session.server";
import { verifyLogin, validateUserEmail } from "~/services/user.server";
import { safeRedirect } from "~/utils/routing";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import { Container, Box, Button, TextField, Paper } from "@mui/material";
import { AuthenticityTokenInput } from "~/components/csrf";
import { verifyAuthenticityToken } from "~/utils/csrf.server";

export async function loader({ request }: LoaderArgs) {
  
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const session = await getSession(request);
  const formData = await request.formData();

  console.log('onAction: ' + session.get('csrf'))

  await verifyAuthenticityToken(formData, session);

  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/notes");
  const remember = formData.get("remember");



  if (!validateUserEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/notes";
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form method="post">
      <AuthenticityTokenInput />

      <Box sx={{ marginTop: 8 }}>
        <Container maxWidth="xs">
          <Paper sx={{ padding: 6 }}>
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextField
                name="email"
                label="Email"
                variant="standard"
                margin="normal"
                type="email"
                focused
              />
              <FormErrorHelperText name="email" actionData={actionData} />

              <TextField
                name="password"
                label="Password"
                variant="standard"
                margin="normal"
                type="password"
              />
              <FormErrorHelperText name="password" actionData={actionData} />
            </Box>

            <Box sx={{ marginTop: 2, display: "flex", justifyContent: "end" }}>
              <Button type="submit" variant="outlined" color="primary">
                Log in
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Form>
  );
}
